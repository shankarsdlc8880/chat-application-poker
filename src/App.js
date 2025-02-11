import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import {
  JOIN_CLUB_ROOM,
  LEAVE_CLUB_ROOM,
  SEND_CLUB_MESSAGE,
  RECEIVE_CLUB_MESSAGE,
} from "./soketConstants";

const SOCKET_URL = "http://localhost:4001"; // Change this to your backend socket URL

const App = () => {
  const [userId, setUserId] = useState("");
  const [conversationId, setConversationId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [joined, setJoined] = useState(false);

  const socketRef = useRef(null);

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

    // Handle receiving messages
    socketRef.current.on(RECEIVE_CLUB_MESSAGE, (msg) => {
      console.log("Message received from socket ", msg)
      setMessages((prev) => [...prev, msg]);
    });

    // Leave room when window is closed or refreshed
    const handleUnload = () => {
      if (joined) {
        socketRef.current.emit(LEAVE_CLUB_ROOM, conversationId);
      }
    };

    window.addEventListener("beforeunload", handleUnload);
    window.addEventListener("unload", handleUnload);

    return () => {
      handleUnload(); // Leave room before unmounting
      socketRef.current.disconnect();
      socketRef.current.off(RECEIVE_CLUB_MESSAGE); // Remove event listener
      window.removeEventListener("beforeunload", handleUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, [joined, conversationId]);

  const joinChat = () => {
    if (userId.trim() && conversationId.trim()) {
      socketRef.current.emit(JOIN_CLUB_ROOM, { conversationId, userId });
      setJoined(true);
    }
  };

  const leaveChat = () => {
    if (joined) {
      socketRef.current.emit(LEAVE_CLUB_ROOM, conversationId);
      setJoined(false);
      setMessages([]);
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      socketRef.current.emit(SEND_CLUB_MESSAGE, {
        conversationId,
        message,
        senderId: socketRef.current.id, // Unique socket ID
        senderUserId: userId, // User ID from input
      });
      setMessage("");
    }
  };

  return (
    <div style={styles.container}>
      {!joined ? (
        <div style={styles.joinBox}>
          <input
            type="text"
            placeholder="Enter Conversation ID"
            value={conversationId}
            onChange={(e) => setConversationId(e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Enter User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            style={styles.input}
          />
          <button onClick={joinChat} style={styles.button}>Join Chat</button>
        </div>
      ) : (
        <div style={styles.chatBox}>
          <button onClick={leaveChat} style={styles.leaveButton}>Leave Chat</button>
          <div style={styles.messages}>
            {messages.map((msg, i) => (
              <p key={i} style={msg.senderUserId === userId ? styles.myMessage : styles.otherMessage}>
                <strong>{msg.senderUserId}: </strong> {msg.message}
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
