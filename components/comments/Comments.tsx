import { auth } from "@/auth";
import { BlogWithUser } from "@/types";
import Heading from "../common/Heading";
import AddCommentsForm from "./AddCommentsForm";
import ListComments from "./ListComments";
import { getComments } from "@/action/comments/get-comments";
import Alert from "../common/Alert";

const Comments = async ({ blog }: { blog: BlogWithUser }) => {
  const session = await auth();
  const userId = session?.user.userId;

  const { success } = await getComments(blog.id, null, userId);

  return (
    <div>
      <Heading title="Comments" />
      {userId ? (
        <AddCommentsForm
          blogId={blog.id}
          userId={userId}
          creatorId={blog.userId}
        />
      ) : (
        <Alert error message="Please Create Account or Login!" />
      )}
      {!!success?.comments.length && (
        <ListComments comments={success.comments} />
      )}
    </div>
  );
};

export default Comments;
