// Owner: Kevin Luwemba Mugumya
// Version 2

// Research experiments for fetching DHT11 sensor data via MQTT using ESP 32
// The MQTT broker server: unm-mqtt-broker.duckdns.org was developed and setup using Linux.    
// The broker research server handles all the sensor traffic and the data handling logic is provided in django.
// The server was configured with TLS websockets protocol only accessible via port 8083. Unsecure access is via port 8883
// Sensor data payload is published in JSON format i.e {"Humidity":49.00,"Temperature_C":31.70,"Temperature_F":89.06,"HeatIndex_C":33.60,"HeatIndex_F":92.48}

#include "DHT.h"
#include <ESP8266WiFi.h>        
#include <WiFiClient.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>

// wifi auth settings
#define WIFI_AP "lohhockmeng 2.4G@unifi"
#define WIFI_PASSWORD "0126890907"

// Define DHT data pin and sensor type
#define DHTPIN D2
#define DHTTYPE DHT11

// Initialize DHT sensor
DHT dht(DHTPIN, DHTTYPE);

// MQTT Topics
#define humidity_topic "sensors/esp32/dht/temperature/tts"
#define temperature_topic "sensors/esp32/dht/humidity/tts"

// variables for creating and connecting to the MQTT research broker (server)
const char* mqttServer = "unm-mqtt-broker.duckdns.org";
const int mqttPort = 8883;
const char* mqttUser = "kevin";
const char* mqttPassword = "Pl33nkmls49x@";
static const char fp[] PROGMEM = "CF:73:3A:B9:BD:38:EA:E0:44:EB:68:1E:98:E3:60:2B:E7:2B:74:D1";

// declaring an object of BearSSL::WiFiClientSecure class that handles TLS encrypted connection to mqtt broker
BearSSL::WiFiClientSecure net;

// declaring an object of PubSubClient class which receives as input of the constructor from above
PubSubClient client(net);

unsigned long lastSend;

void setup() 
{
  // initialize serial for debugging
  Serial.begin(9600);       
  delay(10);
  
  InitWiFi();
  
  reconnect();
  Serial.print('\n');
  
  Serial.println("Reading and sending sensor data");
  delay(1000);
  Serial.println("RH\t\tTemp (C)\tTemp (F)\tHeat Index (C)\tHeat Index (F)");
  dht.begin();
  lastSend = 0; 
}
  
void loop() 
{
  if ( !client.connected() ) {
    reconnect();
  }

  if ( millis() - lastSend > 1000 ) { // Update and send only after 1 seconds
    getAndSendTemperatureAndHumidityData();
    lastSend = millis();
  }
  
  client.loop();
}

//-----------------Reading Sensor data--------------------
void getAndSendTemperatureAndHumidityData()
{
  delay(1000);
  
  // Reading temperature or humidity takes about 250 milliseconds!
  float humidity = dht.readHumidity();
  // Read temperature as Celsius (the default)
  float temperature_C = dht.readTemperature();
  // Read temperature as Fahrenheit (isFahrenheit = true)
  float temperature_F = dht.readTemperature(true);

  // Check if any reads failed and exit early (to try again).
  if (isnan(humidity) || isnan(temperature_C)) {
    Serial.println("Failed to read from DHT sensor");
    return;
  }

  // Compute heat index in Fahrenheit (the default)
  float heatIndex_F = dht.computeHeatIndex(temperature_F, humidity);
  // Compute heat index in Celsius (isFahreheit = false)
  float heatIndex_C = dht.computeHeatIndex(temperature_C, humidity, false);
  
  Serial.print(humidity); Serial.print(" %\t\t");
  Serial.print(temperature_C); Serial.print(" *C\t");
  Serial.print(temperature_F); Serial.print(" *F\t");
  Serial.print(heatIndex_C); Serial.print(" *C\t");
  Serial.print(heatIndex_F); Serial.println(" *F");

  String hum = String(humidity);
  String temp_C = String(temperature_C);
  String temp_F = String(temperature_F);
  String hIndex_C = String(heatIndex_C);
  String hIndex_F = String(heatIndex_F);

  // Prepare a JSON payload string
  String payload = "{";
  payload += "\"Humidity\":"; 
  payload += hum; 
  payload += ",";
  payload += "\"Temperature_C\":"; 
  payload += temp_C;
  payload += ",";
  payload += "\"Temperature_F\":"; 
  payload += temp_F;
  payload += ",";
  payload += "\"HeatIndex_C\":"; 
  payload += hIndex_C;
  payload += ",";
  payload += "\"HeatIndex_F\":"; 
  payload += hIndex_F;
  payload += "}";

  // Send payload
  char attributes[payload.length() + 1];
  payload.toCharArray( attributes, (payload.length() + 1));
  client.publish( "sensors/dht/tts", attributes );
  Serial.println( attributes );
}

//-----------------Function connecting ESP module to Wifi-----------------
void InitWiFi()
{
  // attempt to connect to wifi
  Serial.print("Connecting to SSID:  ");
  Serial.print(WIFI_AP); Serial.println(" ...");
  WiFi.begin(WIFI_AP, WIFI_PASSWORD);

  // visual feedback signal while waiting for connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }

  // once connected
  Serial.println('\n');
  Serial.println("Connection established!");  
  Serial.print("IP address:\t");
  Serial.println(WiFi.localIP());
}


//-------------------Connection to secure research MQTT broker-------------------
void reconnect() {
   // first checking SSL cert fingerprint to authenticate connection to broker
  net.setFingerprint(fp);

  // Set the MQTT server details for client to connect to
  client.setServer(mqttServer, mqttPort);

  // Callback function to execute when an MQTT message is received by subscribed client.
  //client.setCallback(callback);
  
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print('\n');
    Serial.println("Connecting to UNM-Research MQTT broker node ...");
    // Attempt to connect (clientId, username, password)
    
    if ( client.connect("ESP8266Client", mqttUser, mqttPassword) ) {
      Serial.println( "[CONNECTED]" );
     } else {
      Serial.print( "Failed with state code: " );
      Serial.print(client.state());
      Serial.println( " : retrying in 5 seconds" );
      
      // Wait 5 seconds before retrying
      delay( 5000 );
    }
  }
}

//------- Callback function for incoming messages to subscribed client-------
//void callback(char* topic, byte* payload, unsigned int length) {
 
//  Serial.print("Message arrived in topic: ");
//  Serial.println(topic);
 
//  Serial.print("Message:");
//  for (int i = 0; i < length; i++) {
//    Serial.print((char)payload[i]);
//  }
 
//  Serial.println();
//  Serial.println("-----------------------");
//}
