"use client";

import { useEffect, useRef, useState } from "react";
import { ChartNoAxesColumnIncreasing } from "lucide-react";
import { incrementBlogView } from "@/action/blogs/increment-view";

export default function BlogViewCounter({
  blogId,
  ReqTracker = false,
  initialCount = 0,
}: {
  blogId: string;
  ReqTracker?: boolean;
  initialCount?: number;
}) {
  const [viewCount, setViewCount] = useState<number>(initialCount);
  const tracked = useRef(false);

  useEffect(() => {
    if (!ReqTracker || tracked.current) return;
    tracked.current = true;

    incrementBlogView(blogId)
      .then((res) => {
        if (res.success && res.counted) {
          setViewCount((c) => c + 1);
        }
      })
      .catch((err) => console.error("Error tracking view:"));
  }, [blogId, ReqTracker]);

  return (
    <span className="flex items-center gap-1 text-sm">
      <ChartNoAxesColumnIncreasing size={20} />
      {viewCount}
    </span>
  );
}
