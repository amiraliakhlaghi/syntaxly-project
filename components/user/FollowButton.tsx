"use client";

import { User } from "@/lib/generated/prisma/client";
import Button from "../common/Button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { createNotification } from "@/action/notifications/createNotification";
import { useSocket } from "@/context/SocketContext";

const FollowButton = ({
  user,
  isFollowing: following,
  isList = false,
}: {
  user: User | Pick<User, "id" | "name" | "image">;
  isFollowing: boolean;
  isList?: boolean;
}) => {
  const [isFollowing, setIsFollowing] = useState(following);
  const [loading, setLoading] = useState(false);
  const { sendNotification } = useSocket();

  const router = useRouter();

  useEffect(() => {
    setIsFollowing(following);
  }, [following]);

  const handleFollow = async () => {
    try {
      setLoading(true);

      const res = await axios.post("/api/follow", { followId: user.id });

      if (res.data.success === "followed") {
        setIsFollowing(true);

        if (user.id) {
          await createNotification({
            recipientId: user.id,
            type: "FOLLOW",
            entityType: "USER",
          });

          sendNotification(user.id);
        }
      } else if (res.data.success === "unfollowed") {
        setIsFollowing(false);
      }

      router.refresh();
    } catch (error) {
      // toast.error(error.response.data.error);
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
