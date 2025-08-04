import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../utils/supabaseClient";

function Chat() {
  const navigate = useNavigate();
  const [logout, setLogout] = useState(false);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState(""); 


  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!selectedUser || !user) return;

    const channel = supabase
      .channel("chat-room")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const newMsg = payload.new;

          if (
            (newMsg.sender_id === selectedUser.id && newMsg.recipient_id === user.id) ||
            (newMsg.sender_id === user.id && newMsg.recipient_id === selectedUser.id)
          ) {
            setMessages((prev) => [...prev, newMsg]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedUser, user]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8000/users/profile/");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchChatHistory = async (selectedUserId) => {
    try {
      const token = localStorage.getItem("access");
      console.log(token);
  
      const res = await fetch(
        `http://localhost:8000/messages/history/${selectedUserId}/`, 
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!res.ok) {
        console.error("Failed to fetch chat history");
        return;
      }
  
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Error fetching chat history:", err);
    }
  };


  const handleLogout = () => {
    setLogout(true);
    alert("You have been logged out!");
    localStorage.removeItem("user");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/");
  };

  const handleUserClick = (u) => {
    setSelectedUser(u);
    setMessages([]);
    fetchChatHistory(u.id);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedUser) return;
  
    try {
      const token = localStorage.getItem("access");
  
      // 1️⃣ Insert into Supabase for realtime updates
      const { error: supabaseError } = await supabase.from("messages").insert([
        {
          sender_id: user.id,
          recipient_id: selectedUser.id,
          content: message,
        },
      ]);
  
      if (supabaseError) {
        console.error("Supabase insert error:", supabaseError);
      }
  
      // 2️⃣ Send to Django backend for persistence
      const res = await fetch("http://localhost:8000/messages/send-message/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sender: user.id,
          recipient: selectedUser.id,
          content: message,
        }),
      });
  
      if (!res.ok) {
        console.error("Failed to send message to Django");
      }
  
      // 3️⃣ Optimistic UI update
      setMessages((prev) => [
        ...prev,
        {
          sender_id: user.id,
          recipient_id: selectedUser.id,
          content: message,
        },
      ]);
  
      setMessage(""); // Clear input
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };
  

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
            justify-content: space-between;
            border-bottom: 1px solid #eee;
          }
          .profile-info {
            display: flex;
            align-items: center;
          }
          .profile img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 10px;
          }
          .logout-btn {
            background: #ff4d4d;
            border: none;
            color: white;
            padding: 6px 10px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
          }
          .logout-btn:hover {
            background: #e60000;
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
            <div className="profile-info">
              <img src="https://i.pravatar.cc/40?img=8" alt="Profile" />
              <div>
                <div style={{ fontWeight: "bold" }}>
                  {user?.username || "Loading..."}
                </div>
              </div>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>

          <div className="search-box">
            <input
              className="search-input"
              type="text"
              placeholder="🔍 Search"
            />
          </div>

          <div className="chat-list">
            {users.map((u) => (
              <div
                key={u.id}
                className="chat-item"
                onClick={() => handleUserClick(u)}
              >
                <div className="chat-info">
                  <img
                    src={u.img || "https://i.pravatar.cc/40"}
                    alt={u.username}
                  />
                  <div>
                    <div className="chat-name">{u.name || u.username}</div>
                    <div className="chat-msg">@{u.username}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-area">
          {selectedUser ? (
            <>
              <div className="chat-header">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={selectedUser.img || "https://i.pravatar.cc/40"}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      marginRight: "10px",
                    }}
                    alt={selectedUser.username}
                  />
                  <div>
                    <div style={{ fontWeight: "bold" }}>
                      {selectedUser.name || selectedUser.username}
                    </div>
                    <div style={{ fontSize: "12px", color: "gray" }}>
                      Conversation
                    </div>
                  </div>
                </div>
              </div>

              <div className="messages">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`message ${
                      m.sender_id === user?.id ? "message-right" : "message-left"
                    }`}
                  >
                    {m.content}
                  </div>
                ))}
              </div>

              <div className="message-input-area">
                <input
                  type="text"
                  className="message-input"
                  placeholder="Type a message..."
                  value={message} // ✅ correct binding
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendMessage();
                  }}
                />
              </div>
            </>
          ) : (
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "gray",
              }}
            >
              Select a user to start chatting
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Chat;
