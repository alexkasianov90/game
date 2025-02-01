import { Injectable } from '@angular/core';
import { MockWebSocket } from '../helpers/websocket';
import { SaveGame } from '../interfaces/save-game';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService implements SaveGame {
  private ws!: MockWebSocket;

  public connect(url: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.warn('WebSocket already connected');
      return;
    }

    this.ws = new MockWebSocket(url);
    this.ws.connect();
  }

  public sendMessage(message: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  public close(): void {
    if (this.ws) {
      this.ws.close();
    }
  }

  public destroy(): void {
    this.close();
  }

  public init(): void {
    this.connect('test url');
  }

  public save<T> (data: T): void {
    this.sendMessage(data);
  }
}
