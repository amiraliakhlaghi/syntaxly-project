"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface BlogsTabsProps {
  userId: string;
  currentTab: string;
  isOwner: boolean;
}

export const BlogsTabs = ({ userId, currentTab, isOwner }: BlogsTabsProps) => {
  const tabs = [
    { key: "all", label: "All", show: true },
    { key: "published", label: "Published", show: true },
    { key: "draft", label: "Drafts", show: isOwner },
    { key: "bookmarks", label: "Bookmarks", show: isOwner },
    { key: "clapped", label: "Clapped", show: isOwner },
  ].filter((t) => t.show);

  return (
    <div className="flex gap-2 border-b overflow-x-auto">
      {tabs.map((t) => (
        <Link
          key={t.key}
          href={`/user/${userId}/${t.key}/1`}
          className={cn(
            "px-4 py-2 text-sm whitespace-nowrap border-b-2 -mb-px transition-colors",
            currentTab === t.key
              ? "border-primary font-semibold text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          {t.label}
        </Link>
      ))}
    </div>
  );
};