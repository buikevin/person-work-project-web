import { io, Socket } from 'socket.io-client';

interface ServerToClientEvents {
  // Define server-to-client events here
  notification: (data: { message: string; type: 'info' | 'success' | 'warning' | 'error' }) => void;
  userStatusUpdate: (data: { userId: string; status: 'online' | 'offline' }) => void;
}

interface ClientToServerEvents {
  // Define client-to-server events here
  join: (data: { userId: string }) => void;
  leave: (data: { userId: string }) => void;
  message: (data: { content: string; receiverId?: string }) => void;
}

class SocketService {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(userId?: string): void {
    if (this.socket?.connected) {
      return;
    }

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';
    
    this.socket = io(socketUrl, {
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: this.maxReconnectAttempts,
      auth: {
        token: localStorage.getItem('authToken'),
        userId,
      },
    });

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        this.disconnect();
      }
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit<T extends keyof ClientToServerEvents>(
    event: T,
    data: Parameters<ClientToServerEvents[T]>[0]
  ): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected. Cannot emit event:', event);
    }
  }

  on<T extends keyof ServerToClientEvents>(
    event: T,
    callback: ServerToClientEvents[T]
  ): void {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off<T extends keyof ServerToClientEvents>(
    event: T,
    callback?: ServerToClientEvents[T]
  ): void {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  get isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

// Create and export singleton instance
export const socketService = new SocketService();
export default socketService;
