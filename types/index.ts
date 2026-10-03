import {
  Blog,
  BlogViewCount,
  Comment,
  User,
} from "@/lib/generated/prisma/client";
import { Dispatch, SetStateAction } from "react";
import { IconType } from "react-icons";
import { FieldErrors, UseFormRegister, FieldValues } from "react-hook-form";

export interface BlogFeedProps {
  params: Promise<{ page: string }>;
  searchParams: Promise<{
    tag: string;
    title: string;
  }>;
}

export interface AddCoversProps {
  setUploadedCover: (cover: string) => void;
  replaceUrl?: string;
}

export interface CoverIamgeProps {
  setUploadedCover: (cover: string | undefined) => void;
  url: string;
  isEditor?: boolean;
}

export type BlogWithUser = Blog & {
  user: Pick<User, "id" | "name" | "image">;
  viewCount: { count: number } | null;
  _count: {
    claps: number;
    comments: number;
  };
  claps: {
    id: string;
  }[];
  bookmarks: {
    id: string;
  }[];
  reports?: { id: string }[];
};

export interface ListBlogsProps {
  blogs: BlogWithUser[];
  hasMore: boolean;
  currentPage: number;
  isUserProfile?: boolean;
}

export interface UserSummaryProps {
  user: Pick<User, "id" | "name" | "image">;
  createdDate?: Date | null;
}

export interface BlockNoteEditorProps {
  onChange?: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

export interface AddCommentsProps {
  blogId: string;
  userId: string;
  parentId?: string;
  repliedToId?: string;
  placeholder?: string;
  creatorId?: string;
}

export type CommentWithUser = Comment & {
  user: Pick<User, "id" | "name" | "image">;
  repliedToUser: Pick<User, "id" | "name"> | null;
  _count: {
    replies: number;
    claps: number;
  };
  claps: {
    id: string;
  }[];
  reports?: { id: string }[];
};

export interface CommentReactionsProps {
  comment: CommentWithUser;
  setShowForm: Dispatch<SetStateAction<boolean>>;
  setShowReplies?: Dispatch<SetStateAction<boolean>>;
  isReply?: boolean;
}

export interface ButtonProps {
  label: string;
  disabled?: boolean;
  outlined?: boolean;
  small?: boolean;
  icon?: IconType;
  className?: string;
  type?: "submit" | "reset" | "button" | undefined;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface FormFieldProps<T extends FieldValues> {
  id: string;
  type?: string;
  disabled?: boolean;
  placeholder: string;
  label?: string;
  inputClassName?: string;
  register: UseFormRegister<T>;
  errors: FieldErrors;
}

export interface HeadingProps {
  title: string;
  center?: boolean;
  lg?: boolean;
  md?: boolean;
}

export interface TagProps {
  children: React.ReactNode;
  selected?: boolean;
}

export interface FormFieldProps<T extends FieldValues> {
  id: string;
  disabled?: boolean;
  placeholder: string;
  label?: string;
  inputClassNames?: string;
  register: UseFormRegister<T>;
  errors: FieldErrors;
}

export interface iSocketContext {
  refetchNotifications: boolean;
  sendNotification: (recipientId: string) => void;
  handleRefetchNotifications: () => void;
}

export type UserWithFollows = User & {
  followers: {
    follower: Pick<User, "id" | "name" | "image"> & {
      followers: {
        id: string;
      }[];
    };
  }[];
  followings: {
    following: Pick<User, "id" | "name" | "image"> & {
      followers: {
        id: string;
      }[];
    };
  }[];
  _count: {
    followers: number;
    followings: number;
  };
};

export type ReportProps = {
  blogId?: string;
  commentId?: string;
  initialState?: boolean;
  Type: "blog" | "comment";
};

export type Filter = "all" | "published" | "draft" | "bookmarks" | "claps";

export type RecentUser = {
  id: string;
  name: string | null;
  image: string | null;
};

export type RecentBlog = {
  id: string;
  title: string;
  coverImage: string | null;
  user: { name: string | null };
};

export type RecentComment = {
  id: string;
  content: string;
  user: { name: string | null };
  _count: { claps: number };
};

export interface AdminAnalyticsProps {
  totalUsers: number;
  totalBlogs: number;
  recentUsers: RecentUser[];
  recentBlogs: RecentBlog[];
  recentComments: RecentComment[];
}

export type AdminUser = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: Date;
};

export type AdminUsersTableProps = {
  users: AdminUser[];
  hasMore: boolean;
  total: number;
  currentSize: number;
};

export type AdminComment = {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  _count: {
    claps: number;
  };
};

export type AdminCommentsTableProps = {
  comments: AdminComment[];
  hasMore: boolean;
  total: number;
  currentSize: number;
};

export type BlogReportItem = {
  id: string;
  createdAt: Date;
  blogId: string | null;
  blog: {
    id: string;
    title: string;
  } | null;
};

export type CommentReportItem = {
  id: string;
  createdAt: Date;
  commentId: string | null;
  comment: {
    id: string;
    content: string;
  } | null;
};

export type AdminBlogsReportsTableProps = {
  reports: BlogReportItem[];
  hasMore: boolean;
  total: number;
  currentSize: number;
};

export type AdminCommentsReportsTableProps = {
  reports: CommentReportItem[];
  hasMore: boolean;
  total: number;
  currentSize: number;
};

export type DeleteConfig = {
  type: "user" | "blog" | "comment";
  id: string;
  label?: string | null;
  buttonTitle?: string;
};

export type AdminBlog = {
  id: string;
  title: string;
  coverImage: string | null;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
};

export type AdminBlogsTableProps = {
  blogs: AdminBlog[];
  hasMore: boolean;
  total: number;
  currentSize: number;
};
