from channels.generic.websocket import AsyncWebsocketConsumer

class MQTTConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        print ("Connected")

    async def disconnect(self, close_code):
        print ("Disconnected")
    