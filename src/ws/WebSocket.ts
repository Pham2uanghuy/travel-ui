// src/ws/websocket.ts
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const socketUrl = 'http://localhost:8080/ws'; // đúng với WebSocketConfig ở backend
let client: Client;

export const connectWebSocket = (userId: number, onMessage: (msg: any) => void) => {
    client = new Client({
        webSocketFactory: () => new SockJS(socketUrl),
        reconnectDelay: 5000,
        debug: str => console.log('WS Debug:', str),
        onConnect: () => {
            console.log('Connected to WebSocket');
            client.subscribe(`/topic/notifications/${userId}`, message => {
                const body = JSON.parse(message.body);
                onMessage(body);
            });
        },
        onStompError: frame => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        },
    });

    client.activate();
};

export const disconnectWebSocket = () => {
    if (client && client.active) {
        client.deactivate();
    }
};
