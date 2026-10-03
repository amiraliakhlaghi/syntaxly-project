import CommentCard from "./CommentCard";
import { CommentWithUser } from "@/types";

const ListComments = ({ comments }: { comments: CommentWithUser[] }) => {
  return (
    <div className="mt-4" id="comments">
      {comments.map((c) => (
        <div key={c.id} id={c.id}>
          <CommentCard comment={c} />
        </div>
      ))}
    </div>
  );
};

export default ListComments;
