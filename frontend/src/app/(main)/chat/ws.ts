import { io } from 'socket.io-client';

export function connectWS() {
    return io(`${process.env.NEXT_PUBLIC_BACKEND_URL}`);
}
