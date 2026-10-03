import { auth } from "@/auth";
import Alert from "@/components/common/Alert";
import UserProfile from "@/components/user/UserProfile";
import { db } from "@/lib/db";
import { Filter } from "@/types";

const VALID_FILTERS: Filter[] = [
  "all",
  "published",
  "draft",
  "bookmarks",
  "claps",
];

const User = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string; size?: string }>;
}) => {
  const { id } = await params;
  const { tab, size } = await searchParams;

  const session = await auth();
  const currentUid = session?.user.userId;

  const isOwner = currentUid === id;

  const filterTap: Filter = !isOwner
    ? "published"
    : VALID_FILTERS.includes(tab as Filter)
      ? (tab as Filter)
      : "all";

  const parsedSize = parseInt(size ?? "5", 10);
  const pageSize = Math.min(Math.max(parsedSize || 5, 5), 50);

  const user = await db.user.findUnique({
    where: { id },
    include: {
      followers: {
        include: {
          follower: {
            select: {
              id: true,
              name: true,
              image: true,
              followers: {
                where: { followerId: currentUid },
                select: { id: true },
              },
            },
          },
        },
      },
      followings: {
        include: {
          following: {
            select: {
              id: true,
              name: true,
              image: true,
              followers: {
                where: { followerId: currentUid },
                select: { id: true },
              },
            },
          },
        },
      },
      _count: {
        select: {
          followers: true,
          followings: true,
        },
      },
    },
  });

  if (!user) return <Alert error message="User not found" />;

  const follow = await db.follow.findFirst({
    where: {
      followerId: currentUid,
      followingId: user.id,
    },
  });

  return (
    <UserProfile
      user={user}
      filter={filterTap}
      size={pageSize}
      isFollowing={Boolean(follow)}
      isOwner={isOwner}
    />
  );
};

export default User;
