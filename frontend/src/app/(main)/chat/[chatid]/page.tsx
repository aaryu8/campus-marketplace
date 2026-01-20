"use client"

import { useEffect, useRef, useState } from 'react';
import { connectWS } from '../ws';
import type { Socket } from "socket.io-client";

type Message = {
  id: number;
  sender: string;
  text: string;
  ts: number;
};

const chat = () => {

    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const socket = useRef<Socket | null>(null);
    const [userName, setUserName] = useState('');
    const [showNamePopup, setShowNamePopup] = useState(true);
    const [inputName, setInputName] = useState('');
    const [typers, setTypers] = useState<string[]>([]);

    const [messages, setMessages] = useState<Message[]>([]);
    const [text, setText] = useState('');

    useEffect(() => {
        socket.current = connectWS();

        socket.current.on('connect', () => {
            socket.current?.on('roomNotice', (userName: string) => {
                console.log(`${userName} joined to group!`);
            });

            socket.current?.on('chatMessage', (msg: Message) => {
                setMessages((prev) => [...prev, msg]);
            });

            socket.current?.on('typing', (userName: string) => {
                setTypers((prev) => prev.includes(userName) ? prev : [...prev, userName]);
            });

            socket.current?.on('stopTyping', (userName: string) => {
                setTypers((prev) => prev.filter((typer) => typer !== userName));
            });
        });

        return () => {
            socket.current?.removeAllListeners();
            socket.current?.disconnect();
            socket.current = null;
        };
    }, []);

    useEffect(() => {
        if (!text) return;

        socket.current?.emit('typing', userName);
        if (timer.current) clearTimeout(timer.current);

        timer.current = setTimeout(() => {
            socket.current?.emit('stopTyping', userName);
        }, 1000);

        return () => {
            if (timer.current) clearTimeout(timer.current);
        };
    }, [text, userName]);

    function formatTime(ts: number) {
        const d = new Date(ts);
        const hh = String(d.getHours()).padStart(2, '0');
        const mm = String(d.getMinutes()).padStart(2, '0');
        return `${hh}:${mm}`;
    }

    function handleNameSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const trimmed = inputName.trim();
        if (!trimmed) return;

        socket.current?.emit('joinRoom', trimmed);

        setUserName(trimmed);
        setShowNamePopup(false);
    }

    function sendMessage() {
        const t = text.trim();
        if (!t) return;

        const msg: Message = {
            id: Date.now(),
            sender: userName,
            text: t,
            ts: Date.now(),
        };

        setMessages((m) => [...m, msg]);
        socket.current?.emit('chatMessage', msg);
        setText('');
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-100 p-4 font-inter">
            {showNamePopup && (
                <div className="fixed inset-0 flex items-center justify-center z-40">
                    <div className="bg-white rounded-xl shadow-lg max-w-md p-6">
                        <h1 className="text-xl font-semibold text-black">Enter your name</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Enter your name to start chatting. This will be used to identify
                        </p>
                        <form onSubmit={handleNameSubmit} className="mt-4">
                            <input
                                autoFocus
                                value={inputName}
                                onChange={(e) => setInputName(e.target.value)}
                                className="w-full border border-gray-200 rounded-md px-3 py-2 outline-green-500 placeholder-gray-400"
                                placeholder="Your name (e.g. John Doe)"
                            />
                            <button
                                type="submit"
                                className="block ml-auto mt-3 px-4 py-1.5 rounded-full bg-green-500 text-white font-medium cursor-pointer">
                                Continue
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {!showNamePopup && (
                <div className="w-full max-w-2xl h-[90vh] bg-white rounded-xl shadow-md flex flex-col overflow-hidden">
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
                        <div className="h-10 w-10 rounded-full bg-[#075E54] flex items-center justify-center text-white font-semibold">
                            R
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-medium text-[#303030]">
                                Realtime group chat
                            </div>

                            {typers.length > 0 && (
                                <div className="text-xs text-gray-500">
                                    {typers.join(', ')} is typing...
                                </div>
                            )}
                        </div>
                        <div className="text-sm text-gray-500">
                            Signed in as{' '}
                            <span className="font-medium text-[#303030] capitalize">
                                {userName}
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-100 flex flex-col">
                        {messages.map((m) => {
                            const mine = m.sender === userName;
                            return (
                                <div
                                    key={m.id}
                                    className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                                    <div
                                        className={`max-w-[78%] p-3 my-2 rounded-[18px] text-sm leading-5 shadow-sm ${
                                            mine
                                                ? 'bg-[#DCF8C6] text-[#303030] rounded-br-2xl'
                                                : 'bg-white text-[#303030] rounded-bl-2xl'
                                        }`}>
                                        <div className="break-words whitespace-pre-wrap">
                                            {m.text}
                                        </div>
                                        <div className="flex justify-between items-center mt-1 gap-16">
                                            <div className="text-[11px] font-bold">{m.sender}</div>
                                            <div className="text-[11px] text-gray-500 text-right">
                                                {formatTime(m.ts)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="px-4 py-3 border-t border-gray-200 bg-white">
                        <div className="flex items-center justify-between gap-4 border border-gray-200 rounded-full">
                            <textarea
                                rows={1}
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type a message..."
                                className="w-full resize-none px-4 py-4 text-sm outline-none"
                            />
                            <button
                                onClick={sendMessage}
                                className="bg-green-500 text-white px-4 py-2 mr-2 rounded-full text-sm font-medium cursor-pointer">
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default chat;
