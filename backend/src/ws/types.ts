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
