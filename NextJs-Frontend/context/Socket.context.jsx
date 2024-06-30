import { createContext, useState, useContext, useEffect } from "react";
import io from "socket.io-client";
import { useLoggedInUser } from "@/hooks";

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const URL = process.env.NEXT_PUBLIC_SOCKET_URL;
  const [socket, setSocket] = useState(null);
  const user = useLoggedInUser();

  useEffect(() => {
    if (!user._id || !URL) return;
    const newSocket = io(URL, {
      withCredentials: true,
      transports: ["websocket"],
    });
    newSocket.on("connect", () => {
      if (user?._id) {
        newSocket.emit("go-online", user._id);
      }
    });
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [URL, user?._id]);

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
