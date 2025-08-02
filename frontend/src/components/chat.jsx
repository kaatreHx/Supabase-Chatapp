import React, { useState } from "react";

function Chat() {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);

  return (
    <>
      <style>
        {`
          .chat-container {
            display: flex;
            height: 100vh;
            font-family: Arial, sans-serif;
            background: #f5f5f5;
          }
          .sidebar {
            width: 25%;
            background: white;
            border-right: 1px solid #ddd;
            display: flex;
            flex-direction: column;
          }
          .profile {
            padding: 15px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #eee;
          }
          .profile img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 10px;
          }
          .search-box {
            padding: 10px;
          }
          .search-input {
            width: 100%;
            padding: 8px;
            border-radius: 20px;
            border: none;
            background: #f0f0f0;
            font-size: 14px;
          }
          .chat-list {
            overflow-y: auto;
            flex: 1;
          }
          .chat-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 15px;
            cursor: pointer;
          }
          .chat-item:hover {
            background: #f9f9f9;
          }
          .chat-item img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 10px;
          }
          .chat-info {
            display: flex;
            align-items: center;
          }
          .chat-name {
            font-weight: bold;
            font-size: 14px;
          }
          .chat-msg {
            font-size: 12px;
            color: gray;
          }
          .chat-time {
            font-size: 12px;
            color: gray;
            text-align: right;
          }
          .chat-unread {
            background: red;
            color: white;
            font-size: 10px;
            padding: 2px 6px;
            border-radius: 12px;
            display: inline-block;
            margin-top: 5px;
          }
          .chat-area {
            flex: 1;
            display: flex;
            flex-direction: column;
          }
          .chat-header {
            padding: 15px;
            background: white;
            border-bottom: 1px solid #ddd;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .messages {
            flex: 1;
            padding: 15px;
            overflow-y: auto;
            background: #f9f9f9;
          }
          .date-label {
            text-align: center;
            font-size: 12px;
            color: gray;
            margin: 10px 0;
          }
          .message {
            max-width: 60%;
            padding: 10px;
            border-radius: 10px;
            margin-bottom: 10px;
            font-size: 14px;
          }
          .message-left {
            background: white;
            align-self: flex-start;
          }
          .message-right {
            background: #4e8ef7;
            color: white;
            align-self: flex-end;
          }
          .message-input-area {
            display: flex;
            align-items: center;
            padding: 10px;
            background: white;
            border-top: 1px solid #ddd;
          }
          .message-input {
            flex: 1;
            border: none;
            padding: 10px;
            font-size: 14px;
            border-radius: 20px;
            background: #f0f0f0;
            margin: 0 10px;
            outline: none;
          }
        `}
      </style>

      <div className="chat-container">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="profile">
            <img src="https://i.pravatar.cc/40?img=8" alt="Profile" />
            <div>
              <div style={{ fontWeight: "bold" }}>Ralph Hitman</div>
              <div style={{ fontSize: "12px", color: "gray" }}>@ralph-hitman</div>
            </div>
          </div>
          <div className="search-box">
            <input className="search-input" type="text" placeholder="🔍 Search" />
          </div>
          <div className="chat-list">
            {chats.map((chat) => (
              <div key={chat.id} className="chat-item">
                <div className="chat-info">
                  <img src={chat.img} alt={chat.name} />
                  <div>
                    <div className="chat-name">{chat.name}</div>
                    <div className="chat-msg">{chat.msg}</div>
                  </div>
                </div>
                <div className="chat-time">
                  {chat.time}
                  {chat.unread > 0 && <div className="chat-unread">{chat.unread}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-area">
          <div className="chat-header">
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src="https://i.pravatar.cc/40?img=3" style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "10px" }} alt="Ram Kumar" />
              <div>
                <div style={{ fontWeight: "bold" }}>Ram Kumar</div>
                <div style={{ fontSize: "12px", color: "gray" }}>Conversation</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "15px", color: "gray", fontSize: "18px" }}>
              📞
              🎥
              ⋮
            </div>
          </div>

          <div className="messages">
            <div className="date-label">November 11, 2018</div>
            <div className="message message-left">Hi... Prem. How are you doing?</div>
            <div className="message message-right">Hy Ram ki... I'm good. How about you?</div>
          </div>

          <div className="message-input-area">
            🎤
            <input
              type="text"
              className="message-input"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            📩
          </div>
        </div>
      </div>
    </>
  );
}

export default Chat;
