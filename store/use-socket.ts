"use client";

import { create } from "zustand";
import { io, Socket } from "socket.io-client";

type SocketState = {
  socket: Socket | null;
  isConnected: boolean;
  userId: string | null;

  connect: (userId: string) => void;
  disconnect: () => void;
  sendNotification: (recipientId: string) => void;
};

export const useSocket = create<SocketState>((set, get) => ({
  socket: null,
  isConnected: false,
  userId: null,

  connect: (userId) => {
    const { socket: existing, userId: existingUserId } = get();

    if (existing && existingUserId === userId) return;

    if (existing) {
      existing.removeAllListeners();
      existing.disconnect();
    }

    const socket = io();

    socket.on("connect", () => {
      set({ isConnected: true });
      socket.emit("addOnlineUser", userId);
    });

    socket.on("disconnect", () => {
      set({ isConnected: false });
    });

    //   socket.on("getNotifications", () => {
    //     useNotification.getState().refetch();
    //   });
    //

    set({ socket, userId });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
    }
    set({ socket: null, isConnected: false, userId: null });
  },

  sendNotification: (recipientId) => {
    const { socket, isConnected } = get();
    if (socket && isConnected) {
      socket.emit("onNotification", recipientId);
    }
  },
}));
