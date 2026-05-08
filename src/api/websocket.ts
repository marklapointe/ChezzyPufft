export type WebSocketEventType =
  | 'SocketOpen'
  | 'SocketClose'
  | 'SocketError'
  | 'UserDeleted'
  | 'UserUpdated'
  | 'SessionsUpdated'
  | 'Play'
  | 'Pause'
  | 'Stop'
  | 'Seek'
  | 'VolumeChange'
  | 'Command'
  | 'SubtitleSelection'
  | 'AudioTrackSelection'
  | 'LibraryChanged'
  | 'ScheduledTaskEnded'
  | 'ServerShuttingDown'
  | 'ServerStarted'
  | 'PackageInstalling'
  | 'PackageInstalled'
  | 'Notification';

export interface WebSocketMessage {
  MessageId?: string;
  MessageType: WebSocketEventType;
  Data?: unknown;
  ServerId?: string;
  Timestamp?: string;
}

export interface WebSocketOptions {
  url: string;
  autoReconnect?: boolean;
  maxReconnectAttempts?: number;
  reconnectInterval?: number;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  onMessage?: (message: WebSocketMessage) => void;
}

class EmbyWebSocket {
  private ws: WebSocket | null = null;
  private url: string;
  private autoReconnect: boolean;
  private maxReconnectAttempts: number;
  private reconnectInterval: number;
  private reconnectAttempts: number;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private onOpenCallback?: () => void;
  private onCloseCallback?: () => void;
  private onErrorCallback?: (error: Event) => void;
  private onMessageCallback?: (message: WebSocketMessage) => void;
  private isIntentionallyClosed: boolean = false;

  constructor(options: WebSocketOptions) {
    this.url = options.url;
    this.autoReconnect = options.autoReconnect ?? true;
    this.maxReconnectAttempts = options.maxReconnectAttempts ?? 10;
    this.reconnectInterval = options.reconnectInterval ?? 3000;
    this.reconnectAttempts = 0;
    this.onOpenCallback = options.onOpen;
    this.onCloseCallback = options.onClose;
    this.onErrorCallback = options.onError;
    this.onMessageCallback = options.onMessage;
  }

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.isIntentionallyClosed = false;

    try {
      this.ws = new WebSocket(this.url);
      this.setupEventHandlers();
    } catch (error) {
      this.handleError(error as Event);
    }
  }

  private setupEventHandlers(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.onOpenCallback?.();
    };

    this.ws.onclose = () => {
      this.onCloseCallback?.();
      if (this.autoReconnect && !this.isIntentionallyClosed) {
        this.scheduleReconnect();
      }
    };

    this.ws.onerror = (error) => {
      this.handleError(error);
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.onMessageCallback?.(message);
      } catch {
        console.warn('Failed to parse WebSocket message:', event.data);
      }
    };
  }

  private handleError(error: Event): void {
    console.error('WebSocket error:', error);
    this.onErrorCallback?.(error);
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.warn('Max reconnection attempts reached');
      return;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.reconnectTimer = setTimeout(() => {
      this.reconnectAttempts++;
      console.log(`Reconnecting... attempt ${this.reconnectAttempts}`);
      this.connect();
    }, this.reconnectInterval);
  }

  send(message: WebSocketMessage): boolean {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket not connected');
      return false;
    }

    try {
      this.ws.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error('Failed to send WebSocket message:', error);
      return false;
    }
  }

  close(): void {
    this.isIntentionallyClosed = true;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  onOpen(callback: () => void): void {
    this.onOpenCallback = callback;
  }

  onClose(callback: () => void): void {
    this.onCloseCallback = callback;
  }

  onError(callback: (error: Event) => void): void {
    this.onErrorCallback = callback;
  }

  onMessage(callback: (message: WebSocketMessage) => void): void {
    this.onMessageCallback = callback;
  }
}

let wsInstance: EmbyWebSocket | null = null;

export function getWebSocket(): EmbyWebSocket | null {
  return wsInstance;
}

export function createWebSocket(options: WebSocketOptions): EmbyWebSocket {
  if (wsInstance) {
    wsInstance.close();
  }
  wsInstance = new EmbyWebSocket(options);
  return wsInstance;
}

export { EmbyWebSocket };
