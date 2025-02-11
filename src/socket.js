import io from "socket.io-client";
const SOCKET_URL = "http://localhost:4001"; // Change this to your backend socket URL

const socket = io(SOCKET_URL, {
    transports: ["websocket"], // Use WebSocket for faster connection
    reconnection: true, // Enable auto-reconnection
    reconnectionAttempts: 5, // Retry 5 times
    reconnectionDelay: 2000, // Wait 2 seconds before retrying
  });
  
  socket.on("connect", () => {
    console.log("Connected to server:", socket.id);
  });


  export default socket