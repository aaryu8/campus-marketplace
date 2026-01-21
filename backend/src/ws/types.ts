export type Message = {
    id: string;
    senderId: string;
    senderName: string;
    text: string;
    ts: number;
};

export type TypingUser = {
    id: string;
    name: string;
};
//......
interface ChatMessage {
    id: string;
    conversationId: string;
    senderId: string;
    text: string;
    createdAt: Date;
    sender: {
        id: string;
        name: string;
    };
}

export interface JoinChatPayload {
    chatId: string;
    userId: string;
}

export interface SendMessagePayload {
    chatId: string;
    senderId: string;
    text: string;
}

export interface TypingPayload {
    chatId: string;
    userId: string;
    userName: string;
}

export interface ConversationResponse {
    id: string;
    productId: string;
    buyerId: string;
    sellerId: string;
    product: {
        id: string;
        title: string;
        image: string[];
    };
    buyer: {
        id: string;
        name: string;
        email: string;
    };
    seller: {
        id: string;
        name: string;
        email: string;
    };
    messages: ChatMessage[];
    createdAt: Date;
    updatedAt: Date;
}