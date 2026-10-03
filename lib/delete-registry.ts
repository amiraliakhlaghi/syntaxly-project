import { deleteBlogByAdmin } from "@/action/admin/delete-blog-by-admin";
import { deleteCommentByAdmin } from "@/action/admin/delete-comment-by-admin";
import { deleteUserByAdmin } from "@/action/admin/delete-user-by-admin";
import { DeleteConfig } from "@/types";

export const DELETE_REGISTRY = {
  user: {
    action: deleteUserByAdmin,
    successMessage: "User deleted successfully",
    errorMessage: "Failed to delete user",
    defaultLabel: "this user",
    title: "Delete User",
    description: (label: string) =>
      `Are you sure you want to delete user "${label}"? This action cannot be undone and will permanently remove the account from our servers.`,
    buttonTitle: "Delete user",
  },
  blog: {
    action: deleteBlogByAdmin,
    successMessage: "Blog deleted successfully",
    errorMessage: "Failed to delete blog",
    defaultLabel: "this blog",
    title: "Delete Blog",
    description: (label: string) =>
      `Are you sure you want to delete blog "${label}"? This action cannot be undone.`,
    buttonTitle: "Delete blog",
  },
  comment: {
    action: deleteCommentByAdmin,
    successMessage: "Comment deleted successfully",
    errorMessage: "Failed to delete comment",
    defaultLabel: "this comment",
    title: "Delete Comment",
    description: (label: string) =>
      `Are you sure you want to delete the comment by "${label}"? This action cannot be undone.`,
    buttonTitle: "Delete comment",
  },
} satisfies Record<
  DeleteConfig["type"],
  {
    action: (id: string) => Promise<unknown>;
    successMessage: string;
    errorMessage: string;
    defaultLabel: string;
    title: string;
    description: (label: string) => string;
    buttonTitle: string;
  }
>;
