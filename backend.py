
import asyncio
import websockets
import socket

clients = set()

async def handler(websocket, path):
    clients.add(websocket)
    try:
        async for message in websocket:
            for client in clients:
                if client != websocket:
                    await client.send(message)
    finally:
        clients.remove(websocket)

def get_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
    finally:
        s.close()
    return ip

def start_server():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    start = websockets.serve(handler, "0.0.0.0", 8765)
    loop.run_until_complete(start)
    loop.run_forever()
