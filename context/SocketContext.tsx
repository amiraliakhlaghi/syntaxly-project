"use client";

import { iSocketContext } from "@/types";
import { useSession } from "next-auth/react";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

export const SocketContext = createContext<iSocketContext | null>(null);

export const SocketContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const session = useSession();
  const userId = session.data?.user?.userId;
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [refetchNotifications, setRefetchNotifications] = useState(true);

  const sendNotification = useCallback(
    (recipientId: string) => {
      if (userId && socket && isSocketConnected) {
        socket.emit("onNotification", recipientId);
      }
    },
    [userId, socket, isSocketConnected],
  );

  const handleRefetchNotifications = () => {
    setRefetchNotifications((prev) => !prev);
  };

  //initialize a new socket
  useEffect(() => {
    if (!userId) return;

    const newSocket = io();

    newSocket.on("connect", () => {
      console.log("SOCKET CONNECTED", newSocket.id);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  //listen for connection
  useEffect(() => {
    if (socket === null) return;

    function onConnect() {
      setIsSocketConnected(true);
    }

    function onDisconnect() {
      setIsSocketConnected(false);
    }

    function onNotification() {
      handleRefetchNotifications();
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("getNotifications", onNotification);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("getNotifications", onNotification);
    };
  }, [socket]);

  //set up online users
  useEffect(() => {
    if (!socket || !isSocketConnected || !userId) return;

    socket.emit("addOnlineUser", userId);
  }, [socket, isSocketConnected, userId]);

  return (
    <SocketContext.Provider
      value={{
        refetchNotifications,
        sendNotification,
        handleRefetchNotifications,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (context === null) {
    throw new Error("useSocket must be used within a SocketProvider");
  }

  return context;
};
