import React, { useState } from "react";

const ChatBot = () => {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_KEY = "AIzaSyCCkWNEqHT65sIgjGb4m2SKHih4zOl-KZ8"; // ⚠️ exposed
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `${systemPrompt}\n\nUser: ${userMessage}`,
                },
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
      console.error("Error:", err);
      setChat((prev) => [...prev, { sender: "bot", text: "Something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", fontFamily: "sans-serif" }}>
      <h2>🎓 Skill Mentor Chatbot</h2>
      <div style={{ border: "1px solid #ccc", padding: 10, height: 300, overflowY: "auto", marginBottom: 10 }}>
        {chat.map((msg, idx) => (
          <div key={idx} style={{ textAlign: msg.sender === "user" ? "right" : "left", marginBottom: "10px" }}>
            <b>{msg.sender === "user" ? "You" : "Mentor"}:</b> {msg.text}
          </div>
        ))}
        {loading && <p>Mentor is thinking...</p>}
      </div>
      <input
        type="text"
        placeholder="Ask about skills..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        style={{ width: "75%", padding: 8 }}
      />
      <button onClick={handleSend} style={{ padding: 8, marginLeft: 10 }}>Send</button>
    </div>
  );
};

export default ChatBot;