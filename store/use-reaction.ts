"use client";

import { create } from "zustand";
import { clapBlog as clapBlogAction } from "@/action/blogs/clap-blog";
import { bookmarkBlog as bookmarkBlogAction } from "@/action/blogs/bookmark-blog";
import { reportBlog as reportBlogAction } from "@/action/blogs/report-blog";
import { clapComment as clapCommentAction } from "@/action/comments/clap-comment";
import { reportComment as reportCommentAction } from "@/action/comments/report-comment";
import { createNotification } from "@/action/notifications/createNotification";
import { useSocket } from "./use-socket";

export type BlogReaction = {
  clapCount: number;
  userHasClapped: boolean;
  userHasBookmarked: boolean;
  userHasReported: boolean;
};

export type CommentReaction = {
  clapCount: number;
  userHasClapped: boolean;
  userHasReported: boolean;
};

type ReactionState = {
  blog: Record<string, BlogReaction>;
  comment: Record<string, CommentReaction>;

  clapBlog: (params: {
    blogId: string;
    userId: string;
    blogOwnerId: string;
    initial: BlogReaction;
  }) => Promise<void>;

  bookmarkBlog: (params: {
    blogId: string;
    userId: string;
    initial: BlogReaction;
  }) => Promise<void>;

  reportBlog: (params: {
    blogId: string;
    initial: BlogReaction;
  }) => Promise<void>;

  clapComment: (params: {
    commentId: string;
    userId: string;
    initial: CommentReaction;
  }) => Promise<void>;

  reportComment: (params: {
    commentId: string;
    initial: CommentReaction;
  }) => Promise<void>;

  clear: () => void;
};

export const useReaction = create<ReactionState>((set, get) => ({
  blog: {},
  comment: {},

  clapBlog: async ({ blogId, userId, blogOwnerId, initial }) => {
    const prev = get().blog[blogId] ?? initial;
    const wasClapped = prev.userHasClapped;

    set((s) => ({
      blog: {
        ...s.blog,
        [blogId]: {
          ...prev,
          clapCount: wasClapped ? prev.clapCount - 1 : prev.clapCount + 1,
          userHasClapped: !wasClapped,
        },
      },
    }));

    try {
      const res = await clapBlogAction(blogId, userId);
      if (res?.error) throw new Error(res.error);
    } catch (err) {
      set((s) => ({ blog: { ...s.blog, [blogId]: prev } }));
      throw err;
    }

    if (!wasClapped && blogOwnerId !== userId) {
      try {
        await createNotification({
          recipientId: blogOwnerId,
          type: "NEW_CLAP",
          blogId,
          entityType: "BLOG",
        });
        useSocket.getState().sendNotification(blogOwnerId);
      } catch {
        // non-critical
      }
    }
  },

  bookmarkBlog: async ({ blogId, userId, initial }) => {
    const prev = get().blog[blogId] ?? initial;

    set((s) => ({
      blog: {
        ...s.blog,
        [blogId]: { ...prev, userHasBookmarked: !prev.userHasBookmarked },
      },
    }));

    try {
      const res = await bookmarkBlogAction(blogId, userId);
      if (res?.error) throw new Error(res.error);
    } catch (err) {
      set((s) => ({ blog: { ...s.blog, [blogId]: prev } }));
      throw err;
    }
  },

  reportBlog: async ({ blogId, initial }) => {
    const prev = get().blog[blogId] ?? initial;

    set((s) => ({
      blog: {
        ...s.blog,
        [blogId]: { ...prev, userHasReported: !prev.userHasReported },
      },
    }));

    try {
      const res = await reportBlogAction(blogId);
      if (res?.error) throw new Error(res.error);
    } catch (err) {
      set((s) => ({ blog: { ...s.blog, [blogId]: prev } }));
      throw err;
    }
  },

  clapComment: async ({ commentId, userId, initial }) => {
    const prev = get().comment[commentId] ?? initial;
    const wasClapped = prev.userHasClapped;

    set((s) => ({
      comment: {
        ...s.comment,
        [commentId]: {
          ...prev,
          clapCount: wasClapped ? prev.clapCount - 1 : prev.clapCount + 1,
          userHasClapped: !wasClapped,
        },
      },
    }));

    try {
      const res = await clapCommentAction(commentId, userId);
      if (res?.error) throw new Error(res.error);
    } catch (err) {
      set((s) => ({ comment: { ...s.comment, [commentId]: prev } }));
      throw err;
    }
  },

  reportComment: async ({ commentId, initial }) => {
    const prev = get().comment[commentId] ?? initial;

    set((s) => ({
      comment: {
        ...s.comment,
        [commentId]: { ...prev, userHasReported: !prev.userHasReported },
      },
    }));

    try {
      const res = await reportCommentAction(commentId);
      if (res?.error) throw new Error(res.error);
    } catch (err) {
      set((s) => ({ comment: { ...s.comment, [commentId]: prev } }));
      throw err;
    }
  },

  clear: () => set({ blog: {}, comment: {} }),
}));
