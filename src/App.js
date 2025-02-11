import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { JOIN_ROOM, MESSAGE, SEND_MESSAGE, LEAVE_ROOM } from "./soketConstants";

const SOCKET_URL = "http://localhost:4000"; // Change this to your backend socket URL

const App = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [joined, setJoined] = useState(false);

  const socketRef = useRef(null); // Store socket instance

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to server:", socketRef.current.id);
    });

    socketRef.current.on(MESSAGE, (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socketRef.current.disconnect(); // Cleanup socket connection on unmount
    };
  }, []);

  const joinChat = () => {
    if (username.trim()) {
      const conversationId = "12345";
      socketRef.current.emit(JOIN_ROOM, { conversationId, userId: username });
      setJoined(true);
    }
  };

  const leaveChat = () => {
    if (joined) {
      const conversationId = "12345";
      socketRef.current.emit(LEAVE_ROOM, { conversationId, userId: username });
      setJoined(false);
      setMessages([]); // Clear chat history after leaving
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      socketRef.current.emit(SEND_MESSAGE, { user: username, text: message });
      setMessage("");
    }
  };

  return (
    <div style={styles.container}>
      {!joined ? (
        <div style={styles.joinBox}>
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
          <button onClick={joinChat} style={styles.button}>Join Chat</button>
        </div>
      ) : (
        <div style={styles.chatBox}>
          <button onClick={leaveChat} style={styles.leaveButton}>Leave Chat</button>
          <div style={styles.messages}>
            {messages.map((msg, i) => (
              <p key={i} style={msg.user === username ? styles.myMessage : styles.otherMessage}>
                <strong>{msg.user}: </strong> {msg.text}
              </p>
            ))}
          </div>
          <div style={styles.inputBox}>
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              style={styles.input}
            />
            <button onClick={sendMessage} style={styles.button}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { display: "flex", flexDirection: "column", alignItems: "center", height: "100vh", justifyContent: "center" },
  joinBox: { display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" },
  chatBox: { width: "400px", border: "1px solid #ccc", padding: "10px", borderRadius: "5px" },
  messages: { height: "300px", overflowY: "auto", marginBottom: "10px" },
  inputBox: { display: "flex", gap: "10px" },
  input: { padding: "8px", width: "100%" },
  button: { padding: "8px 16px", cursor: "pointer", background: "#007BFF", color: "#fff", border: "none", borderRadius: "5px" },
  leaveButton: { padding: "8px 16px", cursor: "pointer", background: "#DC3545", color: "#fff", border: "none", borderRadius: "5px", marginBottom: "10px" },
  myMessage: { backgroundColor: "#dcf8c6", padding: "5px", borderRadius: "5px", marginBottom: "5px" },
  otherMessage: { backgroundColor: "#f1f0f0", padding: "5px", borderRadius: "5px", marginBottom: "5px" },
};

export default App;
