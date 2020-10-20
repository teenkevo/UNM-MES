import React, { useState, Fragment } from 'react';

var mqtt    = require('mqtt');
var options = {
    protocol: 'mqtts',
    username: 'kevin',
    password: 'Pl33nkmls49x@',
    clientId: 'b0908853'    
};
var client  = mqtt.connect('mqtts://unm-mqtt-broker.duckdns.org', options);

// preciouschicken.com is the MQTT topic
client.subscribe('preciouschicken.com');

function MQTT() {
  var note;
  client.on('message', function (topic, message) {
    note = message.toString();
    // Updates React state with message 
    setMesg(note);
    console.log(note);
    client.end();
    });

  // Sets default React state 
  const [mesg, setMesg] = useState(<Fragment><em>nothing heard</em></Fragment>);

  return (
    <div className="MQTT">
    <header className="MQTT-header">
    <h1>A taste of MQTT in React</h1>
    <p>The message is: {mesg}</p>
        <p>
        <a href="https://www.preciouschicken.com/blog/posts/a-taste-of-mqtt-in-react/"    
        style={{
            color: 'white'
        }}>preciouschicken.com/blog/posts/a-taste-of-mqtt-in-react/</a>
        </p>
        </header>
        </div>
  );
}

export default MQTT;