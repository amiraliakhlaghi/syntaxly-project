"use client";

import { LogOut, Pencil, Shield, User, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const UserButton = () => {
  const session = useSession();
  const imageUrl = session.data?.user.image || "";
  const router = useRouter();

  const isAdmin = session.data?.user.role === "ADMIN";

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    window.location.href = "/blog/feed/1";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={imageUrl} />
          <AvatarFallback className="border-2 border-slate-500 dark:border-slate-50">
            <UserRound />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem
          onSelect={() => router.push(`/user/${session.data?.user.userId}`)}
          className="flex gap-2 items-center"
        >
          <User size={18} /> Profile
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={() => router.push("/blog/create")}
          className="flex gap-2 items-center"
        >
          <Pencil size={18} /> Create Post
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {isAdmin && (
          <>
            <DropdownMenuItem
              onSelect={() => router.push("/admin")}
              className="flex gap-2 items-center"
            >
              <Shield size={18} /> Admin
            </DropdownMenuItem>

            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem
          onSelect={handleSignOut}
          className="flex gap-2 items-center"
        >
          <LogOut size={18} /> Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
