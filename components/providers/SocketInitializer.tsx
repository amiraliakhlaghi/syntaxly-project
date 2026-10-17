"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSocket } from "@/store/use-socket";

export const SocketInitializer = () => {
  const { data: session } = useSession();
  const userId = session?.user?.userId;

  const connect = useSocket((s) => s.connect);
  const disconnect = useSocket((s) => s.disconnect);

  useEffect(() => {
    if (!userId) return;

    connect(userId);

    return () => {
      disconnect();
    };
  }, [userId, connect, disconnect]);

  return null;
};
