"use client";

import { User } from "@/lib/generated/prisma/client";
import Button from "../common/Button";
import toast from "react-hot-toast";
import { useSocket } from "@/store/use-socket";
import { useFollow } from "@/store/use-follow";
import { useState } from "react";

const FollowButton = ({
  user,
  isFollowing: initialFollowing,
  isList = false,
}: {
  user: User | Pick<User, "id" | "name" | "image">;
  isFollowing: boolean;
  isList?: boolean;
}) => {
  const storeFollowing = useFollow((s) => s.following[user.id]);
  const follow = useFollow((s) => s.follow);
  const [loading, setLoading] = useState(false);
  const sendNotification = useSocket((s) => s.sendNotification);

  const isFollowing = storeFollowing ?? initialFollowing;

  const handleFollow = async () => {
    if (loading) return;
    setLoading(true);

    try {
      await follow({
        targetUserId: user.id,
        initial: initialFollowing,
      });
    } catch {
      toast.error("Failed to update follow state");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      outlined
      label={loading ? "Loading..." : isFollowing ? "Unfollow" : "Follow"}
      onClick={handleFollow}
      disabled={loading}
      small={isList}
    />
  );
};

export default FollowButton;
