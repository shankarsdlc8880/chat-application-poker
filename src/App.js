import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { JOIN_ROOM, MESSAGE, SEND_MESSAGE } from "./soketConstants";

const socket = io("http://localhost:4000"); // Connect to backend

const App = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    socket.on(MESSAGE, (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off(MESSAGE);
  }, []);

  const joinChat = () => {
    if (username.trim()) {
      socket.emit(JOIN_ROOM, username);
      setJoined(true);
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit(SEND_MESSAGE, { user: username, text: message });
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
  myMessage: { backgroundColor: "#dcf8c6", padding: "5px", borderRadius: "5px", marginBottom: "5px" },
  otherMessage: { backgroundColor: "#f1f0f0", padding: "5px", borderRadius: "5px", marginBottom: "5px" },
};

export default App;
