import React, { useState } from 'react';
import ConversationList from './conversationList';

const ConversationsPage = () => {
    const [submitted, setSubmitted] = useState(false);
    const [clubId, setClubId] = useState("67aed51a38826e2c440006bd");
    const [userId, setUserId] = useState("2d143794-aa17-4d54-9d1b-6be20ac79378");
    const [token, setToken] = useState("eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJkODY5ODgyLWQyYjgtNGFjMS1hMzMxLTE5MDE3MTQ0NjBiYiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzM5NDI1NjIzLCJleHAiOjE3NDIwMTc2MjMsImlzcyI6IlBva2VyIEF1dGhlbnRpY2F0aW9uIHNlcnZpY2UiLCJzdWIiOiJ0ZXN0QHNkbGNjb3JwLmNvbSJ9.UYJJU5on0jcU9vtkQxdcsyaM5R7V7gGxpRnwZSzqOsGWMMJxrW51-u-gSf1UFpyM1wGrLcirClymYj7V5tCotGtCFp4VD3OBg-rS0YlqjnitCQpBu9-pt9draFDzO8KFFdmN3_X0hKXOtspROfofhsCehnlXxZKXLWyc9sR0ZXbKgG1CMI8vZ21QJHsun1PyXkAGF2i7sg9ovhW9hw-lRObjwTKMKwhftuVwaZIOdonDLo7Q5hTt3wRaCbiRK9HgkRq_eKCQo77WemY9mElXD2jYxiQ-K7sja0TKswn5ZmG-f9VKg_IwKcjH0Lm79M_oLdw1wFW4M16SHWY7k50ZzA");

    const handleSubmitClick = () => {
        if (clubId) setSubmitted(true);
        localStorage.setItem("accessToken", token);
    }
    return (
        <div style={styles.container}>
            {!submitted ?
                <div style={styles.joinBox}>
                    <div>
                        <p>Club ID</p>
                        <input type="text" placeholder="Enter Club ID" value={clubId} onChange={(e) => setClubId(e.target.value)} style={styles.input} />
                    </div>
                    <div>
                        <p>User Token</p>
                        <input type="text" placeholder="Enter User Token" value={token} onChange={(e) => setToken(e.target.value)} style={styles.input} />
                    </div>
                    <div>
                        <p>User Id</p>
                        <input type="text" placeholder="Enter User Token" value={userId} onChange={(e) => setUserId(e.target.value)} style={styles.input} />
                    </div>
                    {/* <input type="text" placeholder="Enter your room id" value={roomId} onChange={(e) => setRoomId(e.target.value)} style={styles.input} /> */}
                    <button onClick={handleSubmitClick} style={styles.button}>Submit</button>
                    {/* <button onClick={joinChat} style={styles.button}>Join Chat</button> */}
                </div>
                :
                <ConversationList clubId={clubId} token={token} userId={userId} />
            }
        </div>
    )
}

const styles = {
    container: { textAlign: "center", padding: "20px" },
    input: {
        width: "100%",
        padding: "10px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        fontSize: "14px",
        marginBottom: "16px",
        outline: "none",
        maxWidth: "300px"
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "space-between",
    },
    button: { padding: "10px", background: "#007BFF", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" },

};

export default ConversationsPage