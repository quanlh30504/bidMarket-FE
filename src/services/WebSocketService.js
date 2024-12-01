import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  constructor(webSocketUrl) {
    this.webSocketUrl = webSocketUrl;
    this.stompClient = null;
  }

  connect(onConnectCallback, onErrorCallback) {
    const socket = new SockJS(this.webSocketUrl);
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log('[WebSocket Debug]:', str),
      onConnect: onConnectCallback,
      onStompError: (frame) => {
        console.error('[WebSocket Error]:', frame.headers['message']);
        if (onErrorCallback) onErrorCallback(frame.headers['message']);
      },
    });

    this.stompClient.activate();
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
      console.log('Disconnected from WebSocket');
    }
  }

  subscribe(topic, callback) {
    if (!this.stompClient || !this.stompClient.connected) {
      console.error('WebSocket is not connected');
      return null;
    }

    return this.stompClient.subscribe(topic, (message) => {
      const data = JSON.parse(message.body);
      callback(data);
    });
  }

  unsubscribe(subscription) {
    if (subscription) subscription.unsubscribe();
  }

  send(destination, body) {
    if (!this.stompClient || !this.stompClient.connected) {
      console.error('WebSocket is not connected');
      return;
    }

    this.stompClient.publish({
      destination,
      body: JSON.stringify(body),
    });
  }
}

export default WebSocketService;
