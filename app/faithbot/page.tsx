"use client"; // ✅ mark as client component so you can use state/hooks

import { useState } from "react";

export default function FaithBotPage() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/faithbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      setReply(data.reply);
    } catch (err) {
      setReply("⚠️ Something went wrong, bro. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">☀️ FaithBot</h1>
      <textarea
        className="w-full p-2 border rounded mb-2"
        rows={3}
        placeholder="Ask FaithBot anything..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        onClick={sendMessage}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {loading ? "Thinking..." : "Ask"}
      </button>
      {reply && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <strong>FaithBot:</strong> {reply}
        </div>
      )}
    </div>
  );
}
