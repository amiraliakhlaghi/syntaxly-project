"use client";

import { usePathname, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "bookmarks", label: "Bookmarked" },
  { value: "claps", label: "Clapped" },
] as const;

const UserBlogsTabs = ({ currentFilter }: { currentFilter: string }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (value: string) => {
    router.push(`${pathname}?tab=${value}&size=5`, { scroll: false });
  };

  return (
    <Tabs
      value={currentFilter}
      onValueChange={handleChange}
      className="flex items-center justify-center mb-6"
    >
      <TabsList className="flex flex-wrap">
        {FILTERS.map((f) => (
          <TabsTrigger key={f.value} value={f.value}>
            {f.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default UserBlogsTabs;
