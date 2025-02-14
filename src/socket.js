import io from "socket.io-client";
const SOCKET_URL = "http://localhost:4001"; // Change this to your backend socket URL

const useConnectSocket = (userId) =>{
 
  
 
  const connectToSocket =(userId) =>{
    const socket = io(SOCKET_URL, {
      transports: ["websocket"], // Use WebSocket for faster connection
      reconnection: true, // Enable auto-reconnection
      query: {
        userId:userId, // Pass user ID in the query
      },
      reconnectionAttempts: 5, // Retry 5 times
      reconnectionDelay: 2000, // Wait 2 seconds before retrying
    });
    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

    return socket
  }


  return {connectToSocket}

}

  export default useConnectSocket