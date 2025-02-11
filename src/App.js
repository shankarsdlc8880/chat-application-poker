import React, { useState, useEffect } from "react";
import { JOIN_CLUB_ROOM, USER_JOIN_CLUB_ROOM, LEAVE_CLUB_ROOM, SEND_CLUB_MESSAGE, RECEIVE_CLUB_MESSAGE } from "./soketConstants";
import socket from "./socket";

const App = () => {
  const [userId, setUserId] = useState("");
  const [conversationId, setConversationId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [joined, setJoined] = useState(false);
  const [users, setUsers] = useState([]);
  const [roomId, setRoomId] = useState("")
  const [username, setUsername] = useState("");

  useEffect(() => {
    socket.on(RECEIVE_CLUB_MESSAGE, (msg) => {
      console.log("New Message Received", msg);
      setMessages((prev) => [...prev, msg]);
    });

    socket.on(USER_JOIN_CLUB_ROOM, (usernames) => {
      console.log("New User Has Joined the Room", usernames)
      setUsers(usernames);
    });

    return () => {
      socket.off(RECEIVE_CLUB_MESSAGE);
      socket.off(USER_JOIN_CLUB_ROOM);
    };
  }, [joined, conversationId]);

  const joinChat = () => {

    console.log(username, roomId)
    if (username.trim() && roomId.trim()) {
      socket.emit(JOIN_CLUB_ROOM, { memberId: username, conversationId: roomId });
      setJoined(true);
    }
  };

  const leaveChat = () => {
    socket.emit(LEAVE_CLUB_ROOM, { memberId: username, conversationId: roomId });
    setJoined(false);
    setUsers([]);
    setMessages([]);
  };

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit(SEND_CLUB_MESSAGE, { conversationId: roomId, message, senderId: username });
      setMessage("");
    }
  };

  return (
    <div style={styles.container}>
      {!joined ? (
        <div style={styles.joinBox}>

          <input
            type="text"
            placeholder="Enter User ID"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Enter your room id"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            style={styles.input}
          />

          <button onClick={joinChat} style={styles.button}>
            Join Chat
          </button>
        </div>
      ) : (
        <div style={styles.chatBox}>
          <div style={styles.usersList}>
            <h4>Users in Room:</h4>
            {users.length > 0 &&
              users.map((user, index) => (
                <p key={index} style={styles.user}>
                  {index + 1}. {user}
                </p>
              ))}
          </div>
          <button onClick={leaveChat} style={styles.leaveButton}>
            Leave Chat
          </button>
          <div style={styles.messages}>
            {messages.map((msg, i) => (
              <p
                key={i}
                style={msg.sender === username ? styles.myMessage : styles.otherMessage}
              >
                <strong>{msg.sender}: </strong> {msg.message}
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
            <button onClick={sendMessage} style={styles.button}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100vh",
    justifyContent: "center",
    backgroundColor: "#f4f7fc",
  },
  joinBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  chatBox: {
    width: "400px",
    border: "1px solid #ccc",
    padding: "20px",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  usersList: {
    marginBottom: "10px",
    paddingBottom: "10px",
    borderBottom: "1px solid #ccc",
  },
  user: {
    fontSize: "14px",
    margin: "5px 0",
  },
  messages: {
    height: "300px",
    overflowY: "auto",
    marginBottom: "10px",
    padding: "10px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
  },
  inputBox: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    padding: "10px",
    width: "80%",
    borderRadius: "5px",
    border: "1px solid #ddd",
    fontSize: "14px",
  },
  button: {
    padding: "10px 20px",
    cursor: "pointer",
    background: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontSize: "14px",
    transition: "background 0.3s ease",
  },
  leaveButton: {
    padding: "10px 20px",
    cursor: "pointer",
    background: "#DC3545",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    marginBottom: "10px",
    fontSize: "14px",
    transition: "background 0.3s ease",
  },
  myMessage: {
    backgroundColor: "#dcf8c6",
    padding: "8px",
    borderRadius: "5px",
    marginBottom: "5px",
  },
  otherMessage: {
    backgroundColor: "#f1f0f0",
    padding: "8px",
    borderRadius: "5px",
    marginBottom: "5px",
  },
};

export default App;
