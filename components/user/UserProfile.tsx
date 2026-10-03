import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Calendar, UserRound } from "lucide-react";
import moment from "moment";
import { getBlogsByUserId } from "@/action/blogs/get-blogs-by-userid";
import Alert from "../common/Alert";
import ListBlogs from "../blog/ListBlogs";
import EditProfileButton from "./EditProfileButton";
import Tag from "../common/Tag";
import FollowButton from "./FollowButton";
import { auth } from "@/auth";
import FollowerList from "./FollowersList";
import FollowingList from "./FollowingList";
import { Filter, UserWithFollows } from "@/types";
import UserBlogsList from "./UserBlogsList";

const UserProfile = async ({
  user,
  filter,
  size,
  isFollowing,
  isOwner,
}: {
  user: UserWithFollows;
  filter: Filter;
  size: number;
  isFollowing: boolean;
  isOwner: boolean;
}) => {
  const session = await auth();
  const userId = session?.user.userId;

  const { success, error } = await getBlogsByUserId({
    page: 1,
    limit: size,
    userId: user.id,
    filter,
  });

  return (
    <div className="max-w-300 m-auto p-4">
      <div className="flex gap-6 justify-between">
        <div className="flex items-start sm:items-center gap-6 flex-col sm:flex-row">
          <Avatar className="w-20 h-20">
            <AvatarImage src={user?.image ? user?.image : ""} />
            <AvatarFallback className="border-2 border-slate-500 dark:border-slate-50">
              <UserRound />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <h1 className="text-xl sm:text-3xl font-bold">{user.name}</h1>
            {user.bio && <p>{user.bio}</p>}
            <div className="flex items-center gap-4">
              <FollowerList user={user} />
              <FollowingList user={user} />
            </div>
          </div>
        </div>
        <div>
          {userId === user.id && <EditProfileButton user={user} />}
          {userId !== user.id && (
            <FollowButton user={user} isFollowing={isFollowing} />
          )}
        </div>
      </div>
      <div className="flex gap-4 flex-col items-center justify-center p-6 border-y mt-6 flex-wrap">
        {isOwner && (
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <span>
              Id:{" "}
              <span className="bg-secondary ml-2 py-1 px-2 rounded">
                {user.id}
              </span>
            </span>
            <span>
              Email:{" "}
              <span className="bg-secondary ml-2 py-1 px-2 rounded">
                {user.email}
              </span>
            </span>
          </div>
        )}
        <div className="flex justify-center items-center gap-2">
          <Calendar size={18} /> Member Since{" "}
          {moment(user.createdAt).format("MMMM Do YYYY")}
        </div>
      </div>
      <div>
        {!!user.tags.length && (
          <div className="flex items-center justify-center p-6 border-b mb-6 gap-4 flex-wrap">
            {user.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        )}
      </div>
      <div>
        {error && <Alert error message="Error fetching user blogs" />}
        {success && (
          <UserBlogsList
            blogs={success.blogs}
            hasMore={success.hasMore}
            filter={filter}
            size={size}
            userId={user.id}
            isOwner={isOwner}
          />
        )}
      </div>
    </div>
  );
};

export default UserProfile;
