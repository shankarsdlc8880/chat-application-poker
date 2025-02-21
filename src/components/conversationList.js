import React, { useEffect, useState } from "react";
import { apiGET, apiPOST } from "../utils/apiHelper";
import ChatRoom from "../pages/ChatRoom";
import { JOIN_CLUB_ROOM, DELETE_CLUB_MESSAGE, CLUB_ROOM_JOINED, LEAVE_CLUB_ROOM, SEND_CLUB_MESSAGE, RECEIVE_CLUB_MESSAGE, EDIT_CLUB_MESSAGE, ERROR_OCCURED_IN_CLUB_MESSAGE, CLUB_MESSAGE_DELETED, CLUB_MESSAGE_EDITED } from "../soketConstants";

const ConversationList = ({ clubId, userId, socket }) => {
    const [conversationId, setConversationId] = useState("");
    const [joined, setJoined] = useState(false);
    const [users, setUsers] = useState([]);
    const [username, setUsername] = useState("");
    const [messageId, setMessageId] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
    const [updateMessage, setUpdateMessage] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([])
    const [conversationList, setConversationList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeConversation, setActiveConversation] = useState(null);

    useEffect(() => {
        if (clubId) getAllConversations(clubId);
    }, [clubId]);

    async function getAllConversations(clubId) {
        try {
            setLoading(true);
            setError(null);
            const response = await apiPOST(`/v1/conversation/get-all/${clubId}`);
            setConversationList(response?.data?.data?.conversations || []);
            console.log('all conversations ', response?.data?.data?.conversations)
        } catch (err) {
            setError("Failed to fetch conversations.");
        } finally {
            setLoading(false);
        }
    }


    

    useEffect(() => {
       
        if(!socket) return
        socket.on(RECEIVE_CLUB_MESSAGE, (msg) => {
            console.log("New Message Received", msg);
            setMessages((prev) => [...prev, msg.message]);
        });

        socket.on(CLUB_ROOM_JOINED, ({ users, chats }) => {
            console.log("New User Has Joined the Room", users);
            setUsers(users);
            // setMessages(chats)
            console.log("Chats from socket", chats);
        });

        socket.on(CLUB_MESSAGE_EDITED, ({ msg }) => {
            console.log("This get Invoked",msg);
            setMessages((prevMessages) =>
                prevMessages.map((m) => (m._id === msg._id ? msg : m))
            );
        });

        socket.on(ERROR_OCCURED_IN_CLUB_MESSAGE, ({ message }) => {
            console.log("This get Invoked",message);
            alert(message)
            setMessages((prev) => [...prev]);
        });
        
        socket.on(CLUB_MESSAGE_DELETED, ({ messageId }) => {
            console.log("Message deleted event received:", messageId);
            setMessages(prevMessages => prevMessages.filter(msg => msg._id !== messageId));
        });

        return () => {
            socket.off(RECEIVE_CLUB_MESSAGE);
            socket.off(CLUB_ROOM_JOINED);
            socket.off(CLUB_MESSAGE_EDITED);
            socket.off(CLUB_MESSAGE_DELETED);
            socket.off(ERROR_OCCURED_IN_CLUB_MESSAGE);
        };
    }, [joined, conversationId]);

    const joinChat = () => {
        const roomId = activeConversation._id;
        setLoading(true);
        console.log(userId, roomId);
        if (userId.trim() && roomId.trim()) {

            console.log("joining room ", roomId)


            socket.emit(JOIN_CLUB_ROOM, {
                memberId: userId,
                conversationId: roomId,
            });
            setJoined(true);
            setConversationId(roomId);
            setLoading(false);
        }
    };

    const leaveChat = () => {
        const roomId = activeConversation._id;
        socket.emit(LEAVE_CLUB_ROOM, {
            memberId: username,
            conversationId: roomId,
        });
        setJoined(false);
        setUsers([]);
        setMessages([]);
    };

    const sendMessage = () => {
        if (message.trim()) {
            console.log("Sending Message>>>>>");
            socket.emit(SEND_CLUB_MESSAGE, {
                conversationId: activeConversation._id,
                message,
                senderId: userId,
            });
            setMessage("");
        }
    };

    const confirmDeleteMessage = () => {
        const roomId = activeConversation._id;
        if (messageId.trim()) {
            socket.emit(DELETE_CLUB_MESSAGE, { messageId, conversationId:roomId });
            setShowPopup(false);
            setMessageId("");
        }
    };

    const confirmUpdate = () => {
        const roomId = activeConversation._id;
        if (messageId.trim()) {
            socket.emit(EDIT_CLUB_MESSAGE, {
                messageId,
                senderId: username,
                updateMessage,
                conversationId: roomId,
            });
            setMessageId("");
            setUpdateMessage("");
            setUpdateModal(false);
        }
    };


    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Conversations</h2>

            {loading && <p style={styles.loading}>Loading...</p>}
            {error && <p style={styles.error}>{error}</p>}

            {!loading && conversationList.length === 0 && (
                <p style={styles.noData}>No conversations found.</p>
            )}

            <ul style={styles.list}>
                {conversationList.map((conversation) => (
                    <li onClick={() => setActiveConversation(conversation)} key={conversation._id} 
                    // style={styles.listItem}
                    style={{
                        ...styles.listItem, 
                        backgroundColor: activeConversation?._id === conversation._id ? "#d4edda" : "#f5f5f5"
                    }}
                    >
                        {
                            (conversation.type === 'personal' && conversation?.userData?.username)
                            ?<p style={styles.text}>{conversation?.userData?.username + "-" + conversation._id}</p>
                            :<p style={styles.text}>Club Group</p>
                        }
                        
                    </li>
                ))}
            </ul>
            {activeConversation ?
                <ChatRoom
                    joinChat={joinChat}
                    leaveChat={leaveChat}
                    loading={loading}
                    setLoading={setLoading}
                    username={username}
                    setShowPopup={setShowPopup}
                    setMessageId={setMessageId}
                    setUpdateMessage={setUpdateMessage}
                    setUpdateModal={setUpdateModal}
                    sendMessage={sendMessage}
                    showPopup={showPopup}
                    confirmDeleteMessage={confirmDeleteMessage}
                    updateModal={updateModal}
                    updateMessage={updateMessage}
                    confirmUpdate={confirmUpdate}
                    message={message}
                    setMessage={setMessage}
                    messages={messages}
                    setMessages={setMessages}
                    activeConversation={activeConversation}
                    userId ={userId}
                />
                : ""}

        </div>
    );
};

const styles = {
    container: {
        maxWidth: "600px",
        margin: "20px auto",
        padding: "20px",
        backgroundColor: "#fff",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
    },
    heading: {
        fontSize: "20px",
        fontWeight: "bold",
        marginBottom: "16px",
        color: "#333",
    },
    loading: {
        color: "#555",
        fontStyle: "italic",
    },
    error: {
        color: "red",
    },
    noData: {
        color: "#777",
    },
    list: {
        listStyle: "none",
        padding: 0,
    },
    listItem: {
        padding: "10px",
        backgroundColor: "#f5f5f5",
        borderRadius: "6px",
        marginBottom: "8px",
        transition: "background-color 0.2s",
        cursor: "pointer",
    },
    text: {
        color: "#333",
        fontWeight: "500",
    },
};

export default ConversationList;
