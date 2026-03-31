import { io } from 'socket.io-client';

export function connectWS() {
    return io('https://campus-marketplace-production-c93f.up.railway.app');
}
