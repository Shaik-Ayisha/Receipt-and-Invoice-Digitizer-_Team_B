import { useState, useEffect, useRef } from "react";
import "./Bot.css";

function Bot() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I'm your Invoice Assistant. Ask me about your receipts or invoices.",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      text: input,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const token = localStorage.getItem("token"); // if using JWT

      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ message: userMessage.text }),
      });

      const data = await response.json();

      const botReply = {
        sender: "bot",
        text: data.reply || "No response from server.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Error connecting to server.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    }

    setIsTyping(false);
  };

  return (
    <>
      {!isChatOpen && (
        <div className="chat-toggle" onClick={() => setIsChatOpen(true)}>
          💬
        </div>
      )}

      {isChatOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div>
              <strong>AI Assistant</strong>
              <div className="status">Online</div>
            </div>
            <span onClick={() => setIsChatOpen(false)}>✕</span>
          </div>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender}`}>
                <div className="bubble">
                  {msg.text}
                  <div className="timestamp">{msg.time}</div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chat-message bot">
                <div className="bubble typing">Typing...</div>
              </div>
            )}

            <div ref={messagesEndRef}></div>
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend} disabled={!input.trim()}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Bot;