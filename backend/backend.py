
import asyncio
import websockets
import socket
import threading

from decky_plugin import DeckyPlugin, logger

clients = set()
server_loop = None
server_thread = None

def get_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
    finally:
        s.close()
    return ip

async def handler(websocket, path):
    clients.add(websocket)
    try:
        async for message in websocket:
            for client in clients:
                if client != websocket:
                    await client.send(message)
    finally:
        clients.remove(websocket)

def run_server():
    global server_loop
    server_loop = asyncio.new_event_loop()
    asyncio.set_event_loop(server_loop)
    start_server = websockets.serve(handler, "0.0.0.0", 8765)
    server_loop.run_until_complete(start_server)
    server_loop.run_forever()

class Plugin(DeckyPlugin):
    def __init__(self):
        self.running = False

    async def start_server(self) -> dict:
        global server_thread
        if not self.running:
            server_thread = threading.Thread(target=run_server, daemon=True)
            server_thread.start()
            self.running = True
            logger.info("WebSocket server started.")
        return {"status": "started"}

    async def stop_server(self) -> dict:
        global server_loop
        if self.running and server_loop:
            server_loop.call_soon_threadsafe(server_loop.stop)
            self.running = False
            logger.info("WebSocket server stopped.")
        return {"status": "stopped"}

    async def get_ip(self) -> dict:
        return {"ip": get_ip()}
