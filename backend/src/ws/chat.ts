import type { Server, Socket } from 'socket.io';

type Message = { id: number; sender: string; text: string; ts: number; };

export function handleChatSockets(io: Server) {
    const messages: Message[] = []; // optional in-memory store

    io.on('connection', (socket: Socket) => {
        console.log('New user connected', socket.id);

        socket.on('joinRoom', (userName: string) => {
            socket.data.userName = userName;
            socket.join('global'); // all users in one room
            io.to('global').emit('roomNotice', userName);
        });

        socket.on('chatMessage', (msg: Message) => {
            messages.push(msg);
            io.to('global').emit('chatMessage', msg); // broadcast to room
        });

        socket.on('typing', (userName: string) => {
            socket.to('global').emit('typing', userName);
        });

        socket.on('stopTyping', (userName: string) => {
            socket.to('global').emit('stopTyping', userName);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected', socket.data.userName || socket.id);
        });
    });
}
