import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { useNavigate, useLocation } from "react-router-dom";
import "./chatbox.css";

// Replace with your backend chat server URL
const SOCKET_URL = "https://chatservice-skillhub.onrender.com"; // or your deployed backend

const ChatBox = ({ tradesperson }) => {
  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // The person you're chatting with
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get logged-in user info from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  // Connect to socket.io backend
  useEffect(() => {
    if (!user) return;
    const s = io(SOCKET_URL, {
      autoConnect: false,
      transports: ["websocket"],
    });
    s.auth = { username: user.full_name || user.email || "User" };
    s.connect();

    setSocket(s);

    s.on("session", (sessionData) => {
      setSession(sessionData);
      s.auth = { sessionID: sessionData.sessionID };
      localStorage.setItem("chatSessionID", sessionData.sessionID);
    });

    s.on("users", (usersList) => {
      setUsers(usersList.filter(u => u.userID !== session?.userID));
    });

    s.on("private message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      s.disconnect();
    };
    // eslint-disable-next-line
  }, [user]);

  // Restore selected chat on reload
  useEffect(() => {
    if (location.state && location.state.chatUser) {
      setSelectedUser(location.state.chatUser);
    }
  }, [location.state]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Start chat when "Message" is clicked (from profile or artisan list)
  useEffect(() => {
    if (tradesperson) {
      setSelectedUser({
        userID: tradesperson.id || tradesperson._id,
        username: tradesperson.full_name || tradesperson.fname + " " + tradesperson.lname,
      });
    }
  }, [tradesperson]);

  // Load previous messages with selected user
  useEffect(() => {
    if (!selectedUser || !users.length) return;
    const found = users.find(u => u.userID === selectedUser.userID);
    if (found && found.messages) setMessages(found.messages);
    else setMessages([]);
  }, [selectedUser, users]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim() || !socket || !selectedUser) return;
    socket.emit("private message", {
      content: message,
      to: selectedUser.userID,
    });
    setMessages((prev) => [
      ...prev,
      {
        content: message,
        from: session.userID,
        to: selectedUser.userID,
        self: true,
      },
    ]);
    setMessage("");
  };

  // For chat list: click to open chat with user
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setMessages(user.messages || []);
    // Optionally, store in location.state for reload
    navigate("/chatbox", { state: { chatUser: user } });
  };

  return (
    <div className="chatbox-container">
      <div className="chat-users-list">
        <h3>Chats</h3>
        <ul>
          {users.map((u) => (
            <li
              key={u.userID}
              className={selectedUser && selectedUser.userID === u.userID ? "active" : ""}
              onClick={() => handleSelectUser(u)}
            >
              {u.username} {u.connected ? <span className="online-dot" /> : <span className="offline-dot" />}
            </li>
          ))}
        </ul>
      </div>
      <div className="chat-main">
        {selectedUser ? (
          <>
            <div className="chat-header">
              <span>
                Chat with {selectedUser.username}
                {selectedUser.connected ? <span className="online-dot" /> : <span className="offline-dot" />}
              </span>
            </div>
            <div className="chat-messages">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`chat-message ${msg.from === session?.userID ? "sent" : "received"}`}
                >
                  <span>{msg.content}</span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form className="chat-input-form" onSubmit={handleSend}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                autoFocus
              />
              <button type="submit" disabled={!message.trim()}>
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="chat-placeholder">Select a user to start chatting.</div>
        )}
      </div>
    </div>
  );
};

export default ChatBox;