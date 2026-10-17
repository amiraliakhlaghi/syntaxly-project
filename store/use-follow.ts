"use client";

import { create } from "zustand";
import axios from "axios";
import { createNotification } from "@/action/notifications/createNotification";
import { useSocket } from "./use-socket";

type FollowState = {
  following: Record<string, boolean>;

  follow: (params: { targetUserId: string; initial: boolean }) => Promise<void>;

  clear: () => void;
};

export const useFollow = create<FollowState>((set, get) => ({
  following: {},

  follow: async ({ targetUserId, initial }) => {
    const prev = get().following[targetUserId] ?? initial;

    set((s) => ({
      following: { ...s.following, [targetUserId]: !prev },
    }));

    let actualState: boolean;
    try {
      const res = await axios.post("/api/follow", { followId: targetUserId });

      actualState = res.data.success === "followed";

      set((s) => ({
        following: { ...s.following, [targetUserId]: actualState },
      }));
    } catch (err) {
      set((s) => ({
        following: { ...s.following, [targetUserId]: prev },
      }));
      throw err;
    }

    if (actualState && !prev) {
      try {
        await createNotification({
          recipientId: targetUserId,
          type: "FOLLOW",
          entityType: "USER",
        });
        useSocket.getState().sendNotification(targetUserId);
      } catch {
        // non-critical
      }
    }
  },

  clear: () => set({ following: {} }),
}));
