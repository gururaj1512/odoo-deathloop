import React, { useState, useRef } from "react";
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { motion, AnimatePresence } from 'framer-motion';

const ChatBot = () => {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const chatEndRef = useRef(null);

  const API_KEY = "AIzaSyCCkWNEqHT65sIgjGb4m2SKHih4zOl-KZ8";
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
  const systemPrompt = `You are a friendly and futuristic AI mentor who advises students on which skills to learn based on current tech and job market trends. Keep responses short, practical, and inspiring.`;

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setChat((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: `${systemPrompt}\n\nUser: ${userMessage}` },
              ],
            },
          ],
        }),
      });
      const data = await res.json();
      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't generate a response.";
      setChat((prev) => [...prev, { sender: "bot", text: reply }]);
    } catch (err) {
      setChat((prev) => [...prev, { sender: "bot", text: "Something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chat, open]);

  return (
    <>
      {/* Floating Chat Icon */}
      <button
        className="fixed z-50 bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center transition-all focus:outline-none"
        onClick={() => setOpen(true)}
        aria-label="Open Chatbot"
        style={{ boxShadow: '0 4px 24px 0 rgba(37,99,235,0.18)' }}
      >
        <ChatIcon fontSize="large" />
      </button>
      {/* Modal/Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 80, scale: 0.9 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="fixed z-50 bottom-24 right-8 w-80 max-w-[90vw] bg-white rounded-2xl shadow-2xl flex flex-col border border-blue-100"
            style={{ boxShadow: '0 8px 32px 0 rgba(37,99,235,0.18)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-blue-600 rounded-t-2xl">
              <span className="text-white font-bold text-lg">AI Chatbot</span>
              <button onClick={() => setOpen(false)} className="text-white hover:text-blue-200 p-1 rounded-full">
                <CloseIcon />
              </button>
            </div>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 bg-blue-50" style={{ minHeight: 180, maxHeight: 260 }}>
              {chat.map((msg, idx) => (
                <div key={idx} className={`mb-2 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`px-3 py-2 rounded-xl max-w-[80%] text-sm ${msg.sender === "user" ? "bg-blue-600 text-white rounded-br-none" : "bg-white text-gray-800 rounded-bl-none border border-blue-100"}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && <div className="text-blue-600 text-xs mb-2">Mentor is thinking...</div>}
              <div ref={chatEndRef} />
            </div>
            {/* Input */}
            <form
              className="flex items-center gap-2 px-3 py-2 border-t border-gray-100 bg-white rounded-b-2xl"
              onSubmit={e => { e.preventDefault(); handleSend(); }}
            >
              <input
                type="text"
                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm bg-blue-50"
                placeholder="Ask about skills..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend()}
                autoFocus={open}
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 transition-all"
                disabled={!input.trim() || loading}
              >
                <SendIcon />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;