"use client";

import { create } from "zustand";
import { Blog, Comment, Notification } from "@/lib/generated/prisma/client";
import { getNotifications } from "@/action/notifications/getNotifications";
import {
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/action/notifications/markAsRead";

export type LatestNotification = Notification & {
  blog: Pick<Blog, "id" | "title"> | null;
  comment: Pick<Comment, "id" | "content" | "blogId"> | null;
};

type NotificationState = {
  notifications: LatestNotification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;

  refetch: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clear: () => void;
};

export const useNotification = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  refetch: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await getNotifications();

      if (res.error) {
        set({ error: res.error });
        return;
      }

      if (res.success) {
        set({
          notifications: res.success.notifications as LatestNotification[],
          unreadCount: res.success.unreadNotificationCount,
        });
      }
    } catch {
      set({ error: "An error occurred!" });
    } finally {
      set({ isLoading: false });
    }
  },

  markAsRead: async (id) => {
    const prev = get();
    const target = prev.notifications.find((n) => n.id === id);

    if (!target || target.isRead) return;

    set({
      notifications: prev.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n,
      ),
      unreadCount: Math.max(0, prev.unreadCount - 1),
    });

    try {
      const res = await markNotificationAsRead(id);
      if (res?.error) throw new Error(res.error);
    } catch (err) {
      set({
        notifications: prev.notifications,
        unreadCount: prev.unreadCount,
      });
      throw err;
    }
  },

  markAllAsRead: async () => {
    const prev = get();
    if (prev.unreadCount === 0) return;

    set({
      notifications: prev.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    });

    try {
      const res = await markAllNotificationsAsRead();
      if (res?.error) throw new Error(res.error);
    } catch (err) {
      set({
        notifications: prev.notifications,
        unreadCount: prev.unreadCount,
      });
      throw err;
    }
  },

  clear: () =>
    set({
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      error: null,
    }),
}));
