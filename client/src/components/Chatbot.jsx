import React, { useState } from 'react';
import axios from 'axios';

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message to chat
    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      // Send message to backend
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/chat`,
        { message: input }
      );

      // Add bot reply to chat
      const botReply = { sender: 'bot', text: res.data.reply };
      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Server error. Please try again.' },
      ]);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white shadow rounded-lg">
      <div className="h-96 overflow-y-auto border p-2 mb-4 rounded">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 p-2 rounded-lg w-fit max-w-[80%] text-sm ${
              msg.sender === 'user'
                ? 'ml-auto bg-blue-100 text-right'
                : 'bg-gray-100 text-left'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border p-2 rounded focus:outline-none"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
