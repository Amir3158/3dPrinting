import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ noServer: true });

export const broadcast = (message: any) => {
    wss.clients.forEach((client) => {
        if (client.readyState === 1) { // 1 = WebSocket is open
            client.send(JSON.stringify(message));
        }
    });
};

export const setupWebSocketServer = (server: any) => {
    server.on("upgrade", (request: any, socket: any, head: any) => {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit("connection", ws, request);
        });
    });
    console.log("WebSocket server is ready.");
};
