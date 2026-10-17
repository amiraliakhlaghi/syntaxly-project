"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BlogSchemaType } from "@/schemas/BlogSchema";
import { createBlog } from "@/action/blogs/create-blog";
import { editBlog } from "@/action/blogs/edit-blog";
import { deleteBlog as deleteBlogAction } from "@/action/blogs/delete-blog";

export type BlogDraft = {
  id: "new" | string;
  title: string;
  content: string;
  coverImage?: string;
  tags: string[];
  updatedAt: number;
};

type BlogState = {
  draft: BlogDraft | null;
  _hasHydrated: boolean;
  isPublishing: boolean;
  isSavingDraft: boolean;
  isDeleting: boolean;
  error: string | null;
  success: string | null;

  initDraft: (
    id: "new" | string,
    initial?: Partial<Omit<BlogDraft, "id" | "updatedAt">>,
  ) => void;
  setDraftField: <K extends keyof Omit<BlogDraft, "id" | "updatedAt">>(
    field: K,
    value: BlogDraft[K],
  ) => void;
  setDraftFields: (
    partial: Partial<Omit<BlogDraft, "id" | "updatedAt">>,
  ) => void;
  clearDraft: () => void;

  publish: (data: BlogSchemaType, blogId?: string) => Promise<boolean>;
  saveAsDraft: (data: BlogSchemaType, blogId?: string) => Promise<boolean>;
  deleteBlog: (blogId: string) => Promise<boolean>;

  resetStatus: () => void;
  setHasHydrated: (value: boolean) => void;
};

export const useBlog = create<BlogState>()(
  persist(
    (set, get) => ({
      draft: null,
      _hasHydrated: false,
      isPublishing: false,
      isSavingDraft: false,
      isDeleting: false,
      error: null,
      success: null,

      initDraft: (id, initial) => {
        const existing = get().draft;

        if (existing?.id === id) return;

        set({
          draft: {
            id,
            title: initial?.title ?? "",
            content: initial?.content ?? "",
            coverImage: initial?.coverImage,
            tags: initial?.tags ?? [],
            updatedAt: Date.now(),
          },
        });
      },

      setDraftField: (field, value) => {
        const current = get().draft;
        if (!current) return;
        set({
          draft: { ...current, [field]: value, updatedAt: Date.now() },
        });
      },

      setDraftFields: (partial) => {
        const current = get().draft;
        if (!current) return;
        set({
          draft: { ...current, ...partial, updatedAt: Date.now() },
        });
      },

      clearDraft: () => set({ draft: null }),

      publish: async (data, blogId) => {
        set({ isPublishing: true, error: null, success: null });

        try {
          const res = blogId
            ? await editBlog({ ...data, isPublished: true }, blogId)
            : await createBlog({ ...data, isPublished: true });

          if (res?.error) {
            set({ error: res.error, isPublishing: false });
            return false;
          }

          set({
            success: res?.success ?? "Blog published",
            isPublishing: false,
            draft: null,
          });
          return true;
        } catch {
          set({ error: "Something went wrong", isPublishing: false });
          return false;
        }
      },

      saveAsDraft: async (data, blogId) => {
        set({ isSavingDraft: true, error: null, success: null });

        try {
          const res = blogId
            ? await editBlog({ ...data, isPublished: false }, blogId)
            : await createBlog({ ...data, isPublished: false });

          if (res?.error) {
            set({ error: res.error, isSavingDraft: false });
            return false;
          }

          set({
            success: res?.success ?? "Draft saved",
            isSavingDraft: false,
          });
          return true;
        } catch {
          set({ error: "Something went wrong", isSavingDraft: false });
          return false;
        }
      },

      deleteBlog: async (blogId) => {
        set({ isDeleting: true, error: null, success: null });

        try {
          const res = await deleteBlogAction(blogId);
          if (res?.error) {
            set({ error: res.error, isDeleting: false });
            return false;
          }

          set({
            success: res?.success ?? "Blog deleted",
            isDeleting: false,
            draft: null,
          });
          return true;
        } catch {
          set({ error: "Something went wrong", isDeleting: false });
          return false;
        }
      },

      resetStatus: () => set({ error: null, success: null }),
      setHasHydrated: (value) => set({ _hasHydrated: value }),
    }),
    {
      name: "syntaxly:blog",
      skipHydration: true,
      partialize: (state) => ({ draft: state.draft }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
