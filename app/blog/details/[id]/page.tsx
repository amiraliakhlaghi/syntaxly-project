import { getBlogById } from "@/action/blogs/getblogbyid";
import { auth } from "@/auth";
import UserSummary from "@/components/blog/UserSummary";
import Alert from "@/components/common/Alert";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import Reactions from "@/components/blog/Reactions";
import Tag from "@/components/common/Tag";
import BlockNoteEditor from "@/components/blog/editor/BlockNoteEditor";
import "./editor.css";
import Comments from "@/components/comments/Comments";
import BlogViewCounter from "@/components/blog/BlogViewCounter";
import Report from "@/components/common/Report";

interface BlogContentProps {
  params: Promise<{ id: string }>;
}

const BlogContent = async ({ params }: BlogContentProps) => {
  const session = await auth();

  const { id } = await params;

  const res = await getBlogById({ blogId: id });

  if (!res.success)
    return <Alert error message="Error Fetching Blog Content" />;

  const blog = res.success.blog;

  if (!blog) return <Alert error message="No blog found!" />;

  return (
    <div className="flex flex-col max-w-225 m-auto gap-4 px-4 sm:gap-6 sm:px-6 lg:px-0">
      {blog.coverImage && (
        <div className="relative w-full h-[35vh] mt-2">
          <Image
            src={blog.coverImage}
            fill
            alt="Cover Image"
            className="object-cover rounded"
          />
        </div>
      )}

      <div className="flex justify-between items-center pt-4 sm:flex-row sm:items-center sm:gap-0">
        {blog.user && (
          <UserSummary user={blog.user} createdDate={blog.createdAt} />
        )}
        {session?.user.userId === blog.userId && (
          <Link className="text-orange-400" href={`/blog/edit/${blog.id}`}>
            Edit
          </Link>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Separator />
        <div className="flex items-center gap-6">
          <Reactions blog={blog} />

          <BlogViewCounter
            blogId={blog.id}
            ReqTracker={true}
            initialCount={blog.viewCount?.count ?? 0}
          />

          <Report
            Type="blog"
            blogId={blog.id}
            initialState={!!blog.reports?.length}
          />
        </div>

        <Separator />
      </div>

      <h2 className="text-4xl font-bold">{blog.title}</h2>

      {!!blog.tags.length && (
        <div className="flex items-center gap-4 flex-wrap">
          {blog.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      )}

      <div>
        <BlockNoteEditor editable={false} initialContent={blog.content} />
      </div>

      <Separator />

      <Comments blog={blog} />
    </div>
  );
};

export default BlogContent;
