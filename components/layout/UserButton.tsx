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
        <DropdownMenuItem>
          <button
            onClick={() => router.push(`/user/${session.data?.user.userId}`)}
            className="flex gap-2 items-center"
          >
            <User size={18} /> Profile
          </button>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <button
            onClick={() => router.push("/blog/create")}
            className="flex gap-2 items-center"
          >
            <Pencil size={18} /> Create Post
          </button>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {isAdmin && (
          <>
            <DropdownMenuItem>
              <button
                onClick={() => router.push("/admin")}
                className="flex gap-2 items-center"
              >
                <Shield size={18} /> Admin
              </button>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem>
          <button onClick={() => signOut()} className="flex gap-2 items-center">
            <LogOut size={18} /> Sign Out
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
