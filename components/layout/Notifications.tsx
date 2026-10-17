"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Blog, Comment, Notification } from "@/lib/generated/prisma/client";
import { cn } from "@/lib/utils";
import { Bell } from "lucide-react";
import moment from "moment";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  useNotification,
  type LatestNotification,
} from "@/store/use-notification";

const Notifications = () => {
  const router = useRouter();
  const pathName = usePathname();
  const { data: session } = useSession();
  const userId = session?.user?.userId;

  const notifications = useNotification((s) => s.notifications);
  const unreadCount = useNotification((s) => s.unreadCount);
  const loading = useNotification((s) => s.isLoading);
  const error = useNotification((s) => s.error);
  const refetch = useNotification((s) => s.refetch);
  const markAsRead = useNotification((s) => s.markAsRead);
  const markAllAsRead = useNotification((s) => s.markAllAsRead);
  const clear = useNotification((s) => s.clear);

  useEffect(() => {
    if (userId) {
      refetch();
    } else {
      clear();
    }
  }, [userId, refetch, clear]);

  useEffect(() => {
    const hash = window.location.hash;
    let timeoutId: ReturnType<typeof setTimeout>;

    if (hash) {
      timeoutId = setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 0);
    }

    return () => clearTimeout(timeoutId);
  }, [pathName]);

  const handleOpen = async (n: LatestNotification) => {
    if (n.entityType === "BLOG" && n.blogId) {
      router.push(`/blog/details/${n.blogId}/#comments`);
    }

    if (n.entityType === "COMMENT" && n.comment?.blogId) {
      router.push(`/blog/details/${n.comment?.blogId}/#${n.comment.id}`);
    }

    if (n.entityType === "USER" && n.senderId) {
      router.push(`/user/${n.senderId}/1`);
    }

    await markAsRead(n.id);
  };

  const handleMarkAll = async () => {
    await markAllAsRead();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative">
        {!!unreadCount && (
          <div className="absolute bg-rose-500 h-6 w-6 rounded-full text-sm flex items-center justify-center bottom-2 left-2">
            <span>{unreadCount}</span>
          </div>
        )}
        <Bell size={20} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full max-w-100">
        <div className="flex gap-4 justify-between mb-2 p-2">
          <h3 className="font-bold text-xl">Notifications</h3>
          <button onClick={handleMarkAll}>Mark all as read</button>
        </div>

        {loading && (
          <DropdownMenuItem>
            <div className="text-sm text-gray-500">Loading...</div>
          </DropdownMenuItem>
        )}

        {error && (
          <DropdownMenuItem>
            <div className="text-sm text-rose-500">{error}</div>
          </DropdownMenuItem>
        )}

        {!loading &&
          !error &&
          !!notifications.length &&
          notifications.map((n) => {
            return (
              <DropdownMenuItem
                onClick={() => handleOpen(n)}
                key={n.id}
                className={cn(
                  "text-sm cursor-pointer mb-4 flex flex-col items-start border",
                  !n.isRead && "bg-secondary",
                )}
              >
                <div>{n.content}</div>
                <span className="text-xs">
                  {moment(new Date(n.createdAt)).fromNow()}
                </span>
              </DropdownMenuItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notifications;
