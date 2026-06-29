"use client";

import React, { useState, useEffect, useRef } from "react";
import { User } from "@/types/user";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

interface ChatbotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export default function ChatbotDrawer({ isOpen, onClose, user }: ChatbotDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const displayName = user ? user.fullName : "John Hardward";

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const userMessage: Message = {
      id: Math.random().toString(),
      sender: "user",
      text: textToSend,
      timestamp: timeStr,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    // Simulate bot response after a short delay
    setTimeout(() => {
      let replyText = "I'm the ToolCrib AI assistant. I can assist you with MRO inventory statistics, machinery maintenance logs, and personnel access controls. Ask me anything about current shop status!";
      const query = textToSend.toLowerCase();

      if (query.includes("what we can do") || query.includes("what we do")) {
        replyText = "I can help you look up inventory stock levels, register new machinery, approve spare part requisitions, and review personnel access privileges in real-time.";
      } else if (query.includes("what kind of question") || query.includes("what can i ask")) {
        replyText = "You can ask me questions like 'How many items are low in stock?', 'Are there any critical maintenance orders pending?', or 'Who is currently online?'.";
      } else if (query.includes("low in stock") || query.includes("stock status") || query.includes("critical stock")) {
        replyText = "Based on current database logs, there is 1 item low in stock: **Titanium Sprocket Gear** (12 units remaining). Standard tires are also at a critical 148 units.";
      } else if (query.includes("maintenance") || query.includes("pending") || query.includes("critical request")) {
        replyText = "Yes, there is 1 critical requisition request: **High-Temp Coolant Filter** requested by Alex J. for CNC Milling Axis-5.";
      } else if (query.includes("online") || query.includes("active session") || query.includes("online users")) {
        replyText = "Currently, there are 3 active sessions in the personnel panel: **Alex Johnson**, **David Chen**, and yourself.";
      }

      const botMessage: Message = {
        id: Math.random().toString(),
        sender: "bot",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputText);
    }
  };

  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        />
      )}

      {/* Drawer Body */}
      <div
        className={`fixed top-4 bottom-4 right-4 w-80 bg-neutral-900 border border-zinc-800 rounded-[20px] shadow-2xl z-50 transition-all duration-350 ease-out flex flex-col justify-between overflow-hidden ${
          isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        {/* Top Header Section */}
        <div className="p-4 flex justify-between items-center border-b border-zinc-800/80">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
              ToolCrib Copilot
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-white transition-colors p-1 rounded-full hover:bg-neutral-800 cursor-pointer"
            title="Close panel"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Chat History Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col scrollbar-thin scrollbar-thumb-zinc-800">
          {messages.length === 0 ? (
            /* Welcome mockup layout if empty */
            <div className="my-auto flex flex-col justify-end items-start gap-6 pb-4">
              <div className="space-y-1">
                <div className="text-red-500 text-2xl font-bold font-sans tracking-wide leading-tight">
                  Hello, {displayName}
                </div>
                <div className="text-neutral-400 text-2xl font-medium font-sans tracking-wide leading-tight">
                  What can I help ?
                </div>
              </div>

              {/* Suggestions chips */}
              <div className="flex flex-col gap-2.5 w-full">
                <button
                  onClick={() => handleSendMessage("What we can do ?")}
                  className="w-fit text-left px-4 py-2 bg-zinc-800 hover:bg-zinc-750 border border-zinc-700/50 text-white text-[11px] font-sans font-medium rounded-full transition-colors cursor-pointer max-w-[240px]"
                >
                  What we can do ?
                </button>
                <button
                  onClick={() => handleSendMessage("What kind of question you can ask ?")}
                  className="w-fit text-left px-4 py-2 bg-zinc-800 hover:bg-zinc-750 border border-zinc-700/50 text-white text-[11px] font-sans font-medium rounded-full transition-colors cursor-pointer max-w-[260px]"
                >
                  What kind of question you can ask ?
                </button>
              </div>
            </div>
          ) : (
            /* Message Log */
            <div className="space-y-3 flex-1">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[85%] ${
                    msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                  }`}
                >
                  <div
                    className={`p-3 rounded-2xl text-[11px] font-sans leading-relaxed break-words ${
                      msg.sender === "user"
                        ? "bg-red-500 text-white rounded-tr-none"
                        : "bg-zinc-800 text-neutral-200 rounded-tl-none border border-zinc-700/50"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[8px] text-gray-500 font-mono mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Bottom Input Area */}
        <div className="p-4 border-t border-zinc-850 bg-neutral-900/50">
          <div className="w-full h-24 bg-neutral-950 rounded-[20px] border border-zinc-800 p-3 flex flex-col justify-between relative focus-within:border-zinc-700 transition-colors">
            <textarea
              placeholder="Type message here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent text-white text-xs placeholder-zinc-600 focus:outline-none resize-none h-12 leading-relaxed"
            />
            <div className="flex justify-end items-center">
              <button
                onClick={() => handleSendMessage(inputText)}
                className={`p-1.5 rounded-full transition-colors flex items-center justify-center cursor-pointer ${
                  inputText.trim() ? "bg-red-500 text-white hover:bg-red-600" : "text-neutral-700"
                }`}
                disabled={!inputText.trim()}
                title="Send message"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
