import React from "react";
// import { JOIN_CLUB_ROOM, DELETE_CLUB_MESSAGE, CLUB_ROOM_JOINED, LEAVE_CLUB_ROOM, SEND_CLUB_MESSAGE, RECEIVE_CLUB_MESSAGE, CLUB_MESSAGE_EDITED, EDIT_CLUB_MESSAGE } from "./soketConstants";
// import socket from "./socket";
// import { apiGET } from "./utils/apiHelper";
// import ChatRoom from "./pages/ChatRoom";
import ConversationsPage from "./components/conversationsPage";

const App = () => {

  return <ConversationsPage />

  // return (
  //   <div style={styles.container}>
  //     {!joined ? (
  //       <div style={styles.joinBox}>
  //         <input
  //           type="text"
  //           placeholder="Enter User ID"
  //           value={username}
  //           onChange={(e) => setUsername(e.target.value)}
  //           style={styles.input}
  //         />
  //         <input
  //           type="text"
  //           placeholder="Enter your room id"
  //           value={roomId}
  //           onChange={(e) => setRoomId(e.target.value)}
  //           style={styles.input}
  //         />
  //         <button onClick={joinChat} style={styles.button}>
  //           Join Chat
  //         </button>
  //       </div>
  //     ) : (
  //       <ChatRoom
  //         leaveChat={leaveChat}
  //         loading={loading}
  //         setLoading={setLoading}
  //         messages={messages}
  //         username={username}
  //         setShowPopup={setShowPopup}
  //         setMessageId={setMessageId}
  //         setUpdateMessage={setUpdateMessage}
  //         setUpdateModal={setUpdateModal}
  //         message={message}
  //         sendMessage={sendMessage}
  //         setMessage={setMessage}
  //         showPopup={showPopup}
  //         confirmDeleteMessage={confirmDeleteMessage}
  //         updateModal={updateModal}
  //         updateMessage={updateMessage}
  //         confirmUpdate={confirmUpdate}
  //       />

  //     )}
  //   </div>
  // );
}

const styles = {
  container: { textAlign: "center", padding: "20px" },
  joinBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  chatBox: {
    width: "1000px",
    height: "80vh",
    display: "flex",
    flexDirection: "column",
    margin: "auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#fff",
  },
  messages: {
    flexGrow: 1 /* Allows messages to take up available space */,
    minHeight: "400px" /* Keeps message box from collapsing */,
    maxHeight: "600px",
    overflowY: "auto",
    overflowX: "hidden",
    marginBottom: "20px",
    padding: "10px",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  inputBox: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    padding: "10px",
  },
  input: {
    padding: "10px",
    width: "80%",
    borderRadius: "5px",
    border: "1px solid #ddd",
  },
  button: {
    padding: "10px",
    background: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  // leaveButton: { background: "#DC3545", width: "50%" },
  leaveButton: {
    background: "#DC3545",
    color: "white",
    padding: "15px" /* Increased padding for height */,
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    width: "20%",
    fontSize: "16px" /* Makes the text larger */,
    fontWeight: "bold" /* Improves readability */,
  },
  myMessage: {
    backgroundColor: "#dcf8c6",
    padding: "8px",
    borderRadius: "5px",
    marginBottom: "5px",
    display: "flex",
    justifyContent: "space-between",
  },
  otherMessage: {
    backgroundColor: "#f1f0f0",
    padding: "8px",
    borderRadius: "5px",
    marginBottom: "5px",
    display: "flex",
    justifyContent: "space-between",
  },
  deleteButton: {
    marginLeft: "10px",
    padding: "5px",
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  popup: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  confirmButton: {
    background: "green",
    color: "white",
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  cancelButton: {
    background: "gray",
    color: "white",
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer",
    marginLeft: "10px",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000, // Ensures it appears above everything
  },
  updatePopup: {
    backgroundColor: "#fff",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.25)",
    textAlign: "center",
    width: "320px",
    animation: "fadeIn 0.3s ease-in-out",
  },
  title: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "12px",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
    marginBottom: "16px",
    outline: "none",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  confirmButton: {
    background: "#4CAF50",
    color: "white",
    padding: "10px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    border: "none",
    fontSize: "14px",
    transition: "0.2s",
  },
  cancelButton: {
    background: "#d9534f",
    color: "white",
    padding: "10px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    border: "none",
    fontSize: "14px",
    transition: "0.2s",
  },
};
export default App;
