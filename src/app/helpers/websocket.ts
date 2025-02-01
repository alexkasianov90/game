export class MockWebSocket {
  private isConnected = false;
  private url!: string;
  public readyState: number = 3;

  constructor (url: string) {
    this.url = url;
  }

  public connect(): void {
    if (this.isConnected) {
      console.warn('Mock WebSocket already connected');
      return;
    }
    this.readyState = 1;

    this.isConnected = true;
    console.log('Mock WebSocket connected');
  }

  public send(message: any): void {
    if (!this.isConnected) {
      console.warn('Mock WebSocket is not connected');
      return;
    }
    console.log('Mock WebSocket sent:', message);
  }


  public close(): void {
    this.isConnected = false;
    this.readyState = 3;
    console.log('Mock WebSocket closed');
  }

}
