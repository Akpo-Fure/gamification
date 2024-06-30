import { createContext, useState, useContext, useEffect } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const URL = process.env.NEXT_PUBLIC_API_URL;
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(URL);
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [URL]);

  if (!socket) {
    // implement a loading spinner
    return null;
  }

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export { SocketProvider, useSocket };
