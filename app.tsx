//import { useState } from "react";
//import axios from "axios";
//
//type Message = {
//  role: "user" | "assistant";
//  content: string;
//};
//
//function App() {
//  const [input, setInput] = useState("");
//  const [messages, setMessages] = useState<Message[]>([]);
//
//  const sendMessage = async () => {
//    if (!input.trim()) return;
//    const userMsg: Message = { role: "user", content: input };
//    setMessages((prev) => [...prev, userMsg]);
//
//    const res = await axios.post("http://localhost:5000/api/chat", { message: input });
//    const botMsg: Message = { role: "assistant", content: res.data.reply };
//    setMessages((prev) => [...prev, userMsg, botMsg]);
//    setInput("");
//  };
//
//  return (
//    <div className="p-6 max-w-2xl mx-auto">
//      <h1 className="text-2xl font-bold mb-4 text-center">🤖 AI Chat App</h1>
//      <div className="border rounded-lg p-4 h-96 overflow-y-auto">
//        {messages.map((msg, i) => (
//          <p key={i} className={msg.role === "user" ? "text-blue-500" : "text-green-600"}>
//            <b>{msg.role}:</b> {msg.content}
//          </p>
//        ))}
//      </div>
//      <div className="flex mt-4">
//        <input
//          className="border flex-1 p-2 rounded-l-lg"
//          value={input}
//          onChange={(e) => setInput(e.target.value)}
//          placeholder="Type your message..."
//        />
//        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 rounded-r-lg">
//          Send
//        </button>
//      </div>
//    </div>
//  );
//}

// chatgpt code


//
//export default App;
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Trash2, Plus, Sun, Moon } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Chat = {
  id: string;
  title: string;
  messages: Message[];
  titleEditing?: boolean;
};


const App: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>(() => {
    const saved = localStorage.getItem("chats");
    return saved ? JSON.parse(saved) : [];
  });
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, activeChatId]);

  const activeChat = chats.find((c) => c.id === activeChatId);
  const messages = activeChat?.messages || [];

  // ✅ Create new chat
  const startNewChat = () => {
    const id = Date.now().toString();
    const newChat: Chat = {
      id,
      title: "New Chat",
      messages: [],
      titleEditing: true,
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(id);
  };

  // ✅ Send message
  const sendMessage = async () => {
    if (!input.trim() || !activeChatId) return;

    const newMsg: Message = { role: "user", content: input };
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChatId ? { ...c, messages: [...c.messages, newMsg] } : c
      )
    );
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const aiReply = data.reply || "No response received.";

      setChats((prev) =>
        prev.map((c) =>
          c.id === activeChatId
            ? {
                ...c,
                messages: [...c.messages, { role: "assistant", content: aiReply }],
              }
            : c
        )
      );
    } catch {
      setChats((prev) =>
        prev.map((c) =>
          c.id === activeChatId
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  { role: "assistant", content: "⚠️ Error connecting to server" },
                ],
              }
            : c
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  const renameChat = (id: string, newTitle: string) => {
    setChats((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, title: newTitle, titleEditing: false } : c
      )
    );
  };

  const deleteChat = (id: string) => {
    setChats((prev) => prev.filter((c) => c.id !== id));
    if (id === activeChatId) setActiveChatId(null);
  };

  const clearAllChats = () => {
    if (confirm("Delete all chats?")) {
      setChats([]);
      setActiveChatId(null);
    }
  };
return (
  <div className="relative flex h-screen overflow-hidden bg-linear-to-br from-sky-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-indigo-950 dark:to-black transition-colors">
    {/* 🌌 Animated Glowing Background Particles */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full"
          style={{
            background: `radial-gradient(circle, hsl(${Math.random() * 360}, 80%, 70%), transparent 70%)`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, Math.random() * 50 - 25],
            x: [0, Math.random() * 50 - 25],
            opacity: [0.8, 0.3, 0.8],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 6 + Math.random() * 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>

    {/* 🌈 Animated Sidebar */}
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="relative z-10 w-72 bg-linear-to-br from-indigo-500 via-purple-600 to-pink-500 dark:from-indigo-800 dark:via-purple-900 dark:to-pink-900 shadow-2xl text-white p-4 flex flex-col justify-between backdrop-blur-xl border-r border-white/10"
    >
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-extrabold mb-6 text-center tracking-wide drop-shadow-lg"
        >
          ✨ ChatFee AI
        </motion.h1>

        {/* 🪄 New Chat Button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 2 }}
          whileTap={{ scale: 0.9 }}
          onClick={startNewChat}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-linear-to-r from-cyan-400 via-blue-500 to-purple-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold shadow-lg mb-4 transition-all"
        >
          <Plus size={18} />
          New Chat
        </motion.button>

        {/* 🗂 Chat List */}
        <div className="space-y-2 overflow-y-auto max-h-[60vh] pr-1">
          {chats.length === 0 && (
            <p className="text-center text-white/70 italic">No chats yet...</p>
          )}
          {chats.map((chat) => (
            <motion.div
              key={chat.id}
              whileHover={{ scale: 1.03 }}
              className={`p-3 rounded-lg cursor-pointer flex justify-between items-center transition-all ${
                chat.id === activeChatId
                  ? "bg-white/25 backdrop-blur-lg shadow-inner"
                  : "bg-white/10 hover:bg-white/20"
              }`}
              onClick={() => setActiveChatId(chat.id)}
            >
              {chat.titleEditing ? (
                <input
                  autoFocus
                  className="bg-transparent border-b border-white/60 text-white outline-none w-full"
                  onBlur={(e) => renameChat(chat.id, e.target.value)}
                  defaultValue={chat.title}
                />
              ) : (
                <span
                  className="truncate font-semibold"
                  onDoubleClick={() =>
                    setChats((prev) =>
                      prev.map((c) =>
                        c.id === chat.id ? { ...c, titleEditing: true } : c
                      )
                    )
                  }
                >
                  {chat.title}
                </span>
              )}
              <Trash2
                size={16}
                className="hover:text-red-400 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(chat.id);
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* ⚙️ Footer Controls */}
      <div className="mt-4 border-t border-white/20 pt-4 flex flex-col gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
          onClick={() => setDark((d) => !d)}
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
          {dark ? "Light Mode" : "Dark Mode"}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={clearAllChats}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/80 hover:bg-red-600 text-white font-semibold shadow-md"
        >
          <Trash2 size={18} /> Clear All
        </motion.button>
      </div>
    </motion.aside>

    {/* 💬 Chat Section */}
    <main className="relative z-10 flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`p-3 rounded-2xl max-w-lg ${
              msg.role === "user"
                ? "self-end bg-linear-to-r from-blue-500 to-cyan-400 text-white shadow-lg"
                : "self-start bg-linear-to-r from-purple-500 to-pink-400 text-white shadow-lg"
            }`}
          >
            {msg.content}
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* 🧠 Input Section */}
      {activeChatId && (
        <div className="p-4 border-t border-gray-300 dark:border-gray-700 flex items-center gap-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg">
          <input
            type="text"
            className="flex-1 p-3 rounded-xl bg-white/80 dark:bg-gray-900/60 text-gray-900 dark:text-gray-100 shadow-inner outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={sendMessage}
            disabled={loading}
            className="px-5 py-3 rounded-xl bg-linear-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-semibold shadow-md hover:opacity-90 transition-all"
          >
            {loading ? "..." : "Send"}
          </motion.button>
        </div>
      )}
    </main>
      {/* Main Chat Area */}

    </div>
  );
};

export default App;
