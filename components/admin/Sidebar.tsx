"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  MdAnalytics,
  MdPeople,
  MdArticle,
  MdComment,
  MdReport,
} from "react-icons/md";
import { IconType } from "react-icons";
import { useState } from "react";
import { PanelLeftOpen, PanelRightOpen } from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: IconType;
};

const navItems: NavItem[] = [
  { label: "Analytics", href: "/admin/analytics", icon: MdAnalytics },
  { label: "Users", href: "/admin/users", icon: MdPeople },
  { label: "Blogs", href: "/admin/blogs", icon: MdArticle },
  { label: "Comments", href: "/admin/comments", icon: MdComment },
  { label: "Reports", href: "/admin/reports", icon: MdReport },
];

const Sidebar = () => {
  const [open, setOpen] = useState<boolean | null>(false);

  const pathname = usePathname();

  return (
    <>
      {open && (
        <aside className="w-64 shrink-0 border-r bg-white dark:bg-slate-950">
          <div className="sticky top-16 p-4">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-blue-500 text-white"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200",
                    )}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>
      )}

      <span onClick={() => setOpen(!open)} className="cursor-pointer m-2 top-1">
        {open ? <PanelRightOpen size={20} /> : <PanelLeftOpen size={20} />}
      </span>
    </>
  );
};

export default Sidebar;
