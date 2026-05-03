// src/components/common/ChatBotProvider.tsx

"use client";

import { API_BASE_URLS } from "@/lib/constants";
import { useCartStore, useChatStore } from "@/utils/store";
import { useEffect, useRef, useState } from "react";
import { ChatBubbleLeftRightIcon, PaperAirplaneIcon, XMarkIcon} from "@heroicons/react/24/solid";

const renderOptions = (options: any) => {
    if (!options || Object.keys(options).length === 0) return null;

    const parts = [];

    if (options.size) parts.push(`Size: ${options.size}`);
    if (options.ice) parts.push(`Đá: ${options.ice}`);
    if (options.sugar) parts.push(`Đường: ${options.sugar}`);

    if (parts.length === 0) return null;

    return (
        <div className="text-xs text-gray-600">
        • {parts.join(" • ")}
        </div>
    );
};

const renderToppings = (toppings: any[]) => {
    if (!toppings || toppings.length === 0) return null;

    return (
        <div className="text-xs text-gray-600">
        • Topping:{" "}
        {toppings.map((t, i) => (
            <span key={i}>
            {t.name} x{t.quantity}
            {i !== toppings.length - 1 && ", "}
            </span>
        ))}
        </div>
    );
};

function ConfirmCard(data: any) {
    return (
        <div className="card">
            <h3> Bạn muốn order </h3>

            {data.data.map((item: any, i: number) => (
                <div key={i}>
                <b>{item.product_name}</b> x{item.quantity}
                <div>{renderOptions(item.options)}</div>
                <div>{renderToppings(item.toppings)}</div>
                </div>
            ))}
        </div>
    )
}

export default function ChatBotBox() {
    const [input, setInput] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    const { messages, addMessage } = useChatStore();

    const sendMessage = async () => {
        if (!input) return;

        addMessage({ role: "user", content: input });
        setInput("");

        setLoading(true);

        try {
            const res = await fetch(API_BASE_URLS.AI + "chat/", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: input }),
            });

            const data = await res.json();
            addMessage({
                role: "bot",
                content: data.message,
                intent: data.intent,
                data: data.data,
            });

            if (data.items) {
                useCartStore.setState({
                    items: data.items
                });
            }

        } catch (err) {
            addMessage({ role: "bot", content: "Có lỗi xảy ra 😢" });
        }

        setLoading(false);

        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
    };

    useEffect(() => {
    if (isOpen) {
        setTimeout(() => {
            bottomRef.current?.scrollIntoView({ behavior: "auto" });
        }, 0);
    }
    }, [isOpen]);

    // khi có message mới
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    return (
        <>
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed cursor-pointer bottom-50 right-5 bg-blue-500 text-white p-4 
                        rounded-full shadow-lg hover:scale-105 transition z-9999"
                >
                    <ChatBubbleLeftRightIcon className="w-5 h-5" />
                </button>
            )}

            {isOpen && (
                <div className="fixed z-9999 bottom-5 right-5 w-80 h-[500px] bg-white shadow-xl rounded-2xl flex flex-col">
                    {/* header */}
                    <div className="p-3 border-b border-gray-300 flex justify-between items-center">
                        <span className="font-semibold text-blue-500">Tư vấn khách hàng</span>
                        <button onClick={() => setIsOpen(false)} className="cursor-pointer transition">
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`p-2 rounded-xl max-w-[75%] ${
                                msg.role === "user"
                                    ? "bg-blue-500 text-white ml-auto"
                                    : "bg-gray-200"
                                }`}
                            >
                                {
                                    msg.intent === "confirm" ? <ConfirmCard data={msg.data} /> : msg.content
                                }
                            </div>
                        ))}

                        {loading && (
                            <div className="bg-gray-200 p-2 rounded-xl w-fit">
                                Đang trả lời...
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    <div className="p-2 border-t border-gray-300 flex gap-2">
                        <textarea
                            ref={textareaRef}
                            className="flex-1 border border-gray-300 rounded-xl px-3 py-2 resize-none overflow-hidden"
                            rows={1}
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);

                                const el = textareaRef.current;
                                if (el) {
                                    el.style.height = "auto";
                                    el.style.height = el.scrollHeight + "px";
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage();
                                }                            
                            }}
                        />
                        <button
                            onClick={sendMessage}
                            className="text-blue-400 hover:text-blue-600 pr-3 cursor-pointer transition"
                            disabled={loading}
                            >
                            <PaperAirplaneIcon className="w-8 h-8" />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}