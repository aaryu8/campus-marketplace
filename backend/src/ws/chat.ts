import type { Server, Socket } from 'socket.io';
import { prisma } from '../db.js';
import type { 
    JoinChatPayload, 
    SendMessagePayload, 
    TypingPayload 
} from './types.js';

export function handleChatSockets(io: Server) {
    io.on('connection', (socket: Socket) => {
        console.log('User connected to chat:', socket.id);

        // Join a specific chat room
        socket.on('joinChat', async (payload: JoinChatPayload) => {
            try {
                const { chatId, userId } = payload;

                // Verify user has access to this conversation
                const conversation = await prisma.conversation.findFirst({
                    where: {
                        id: chatId,
                        OR: [
                            { buyerId: userId },
                            { sellerId: userId }
                        ]
                    }
                });

                if (!conversation) {
                    socket.emit('error', { message: 'Unauthorized access to this chat' });
                    return;
                }

                // Join the room
                await socket.join(chatId);
                socket.data.chatId = chatId;
                socket.data.userId = userId;

                console.log(`User ${userId} joined chat ${chatId}`);

                // Load and send chat history
                const messages = await prisma.message.findMany({
                    where: { conversationId: chatId },
                    include: {
                        sender: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'asc' },
                    take: 100
                });
                //asc mean oldest to newset . matlab uss order mai basaed on createdAt order karna msges ko
                socket.emit('chatHistory', messages);

            } catch (error) {
                console.error('Error joining chat:', error);
                socket.emit('error', { message: 'Failed to join chat' });
            }
        });

        // Handle new message
        socket.on('sendMessage', async (payload: SendMessagePayload) => {
            try {
                const { chatId, senderId, text } = payload;

                // Verify sender has access
                const conversation = await prisma.conversation.findFirst({
                    where: {
                        id: chatId,
                        OR: [
                            { buyerId: senderId },
                            { sellerId: senderId }
                        ]
                    }
                });

                if (!conversation) {
                    socket.emit('error', { message: 'Unauthorized' });
                    return;
                }

                // Save message to database
                const message = await prisma.message.create({
                    data: {
                        conversationId: chatId,
                        senderId,
                        text: text.trim()
                    },
                    include: {
                        sender: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                });

                
                // include basically tells k banne k baad sender ka info bhi attach karke dena iss object mai , we can use this info in the backend
                //{
                //   id: "m3",
                //   text: "Hey",
                //   senderId: "u1",

                //   // 👇 this part comes from `include`
                //   sender: {
                //     id: "u1",
                //     name: "Alice"
                //   }
                // }
                // aise hum conversation ka bhi jod sakte they but nahi chahiye abhi


                // Update conversation timestamp
                await prisma.conversation.update({
                    where: { id: chatId },
                    data: { updatedAt: new Date() }
                });

                // Broadcast to all users in this chat room
                io.to(chatId).emit('newMessage', message);

                console.log(`Message sent in chat ${chatId} by user ${senderId}`);

            } catch (error) {
                console.error('Error sending message:', error);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        // Typing indicator
        socket.on('typing', (payload: TypingPayload) => {
            const { chatId, userName } = payload;
            socket.to(chatId).emit('userTyping', { userName });
        });

        socket.on('stopTyping', (payload: TypingPayload) => {
            const { chatId, userName } = payload;
            socket.to(chatId).emit('userStoppedTyping', { userName });
        });

        // Handle disconnect
        socket.on('disconnect', () => {
            const userId = socket.data.userId;
            const chatId = socket.data.chatId;
            console.log(`User ${userId} disconnected from chat ${chatId}`);
        });
    });
}