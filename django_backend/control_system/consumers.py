import json
from channels.generic.websocket import AsyncWebsocketConsumer

class MQTTConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        print ("--sensorSocket handshake with MQTT consumer--")

        await self.send("Hello World")

    async def receive(self, text_data):
        print ("Received a message: ", text_data)
        # Pre-process the data here
        # Send it to postGRES SQL
        # Expose it to the ML logic

    async def disconnect(self, close_code):
        print ("Disconnected from consumer")
    