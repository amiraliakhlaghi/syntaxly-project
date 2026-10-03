"use client";

import { BlogSchema, BlogSchemaType } from "@/schemas/BlogSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { SubmitHandler, useForm } from "react-hook-form";
import FormField from "../common/FormField";
import AddCover from "./AddCover";
import { useEffect, useState, useTransition } from "react";
import CoverIamge from "./CoverImage";
import BlogFormTags from "./BlogFormTags";
import dynamic from "next/dynamic";
import Button from "../common/Button";
import Alert from "../common/Alert";
import { createBlog } from "@/action/blogs/create-blog";
import { Blog } from "@/lib/generated/prisma/client";
import { editBlog } from "@/action/blogs/edit-blog";
import { useEdgeStore } from "@/lib/edgestore";
import { deleteBlog } from "@/action/blogs/delete-blog";
import { useRouter } from "next/navigation";

const BlockNoteEditor = dynamic(() => import("./editor/BlockNoteEditor"), {
  ssr: false,
});
const CreateBlogForm = ({ blog }: { blog?: Blog }) => {
  const session = useSession();
  const userId = session.data?.user.userId;
  const [uploadedCover, setUploadedCover] = useState<string>();
  const [content, setContent] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [isPublishing, startPublishing] = useTransition();
  const [isSavingAsDraft, startSavingAsDraft] = useTransition();
  const [isDeleting, startDeleting] = useTransition();
  const { edgestore } = useEdgeStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<BlogSchemaType>({
    resolver: zodResolver(BlogSchema),
    defaultValues: blog
      ? {
          userId: blog.userId,
          isPublished: blog.isPublished,
          title: blog.title,
          content: blog.content,
          coverImage: blog.coverImage || undefined,
          tags: blog.tags,
        }
      : {
          userId,
          isPublished: false,
        },
  });

  useEffect(() => {
    if (uploadedCover) {
      setValue("coverImage", uploadedCover, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }, [uploadedCover]);

  useEffect(() => {
    if (typeof content === "string") {
      setValue("content", content, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }, [content]);

  useEffect(() => {
    if (blog?.coverImage) {
      setUploadedCover(blog.coverImage);
    }
  }, [blog?.coverImage]);

  const onChange = (content: string) => {
    setContent(content);
  };

  const onPublish: SubmitHandler<BlogSchemaType> = (data) => {
    setSuccess("");
    setError("");

    if (data.tags.length > 4) {
      return setError("Select only 4 tags!");
    }

    startPublishing(() => {
      if (blog) {
        editBlog({ ...data, isPublished: true }, blog.id).then((data) => {
          if (data.error) {
            return setError(data.error);
          }

          if (data.success) {
            return setSuccess(data.success);
          }
        });
      } else {
        createBlog({ ...data, isPublished: true }).then((data) => {
          if (data.error) {
            return setError(data.error);
          }

          if (data.success) {
            return setSuccess(data.success);
          }
        });
      }
    });
  };

  const onSaveDraft: SubmitHandler<BlogSchemaType> = (data) => {
    setSuccess("");
    setError("");

    if (data.tags.length > 4) {
      return setError("Select only 4 tags!");
    }

    startSavingAsDraft(() => {
      if (blog) {
        editBlog({ ...data, isPublished: false }, blog.id).then((data) => {
          if (data.error) {
            return setError(data.error);
          }

          if (data.success) {
            return setSuccess(data.success);
          }
        });
      } else {
        createBlog({ ...data, isPublished: false }).then((data) => {
          if (data.error) {
            return setError(data.error);
          }

          if (data.success) {
            return setSuccess(data.success);
          }
        });
      }
    });
  };

  const onDelete: SubmitHandler<BlogSchemaType> = (data) => {
    setSuccess("");
    setError("");

    startDeleting(async () => {
      if (data.coverImage) {
        await edgestore.publicFiles.delete({
          url: data.coverImage,
        });
      }

      if (blog) {
        deleteBlog(blog.id).then((res) => {
          if (res.error) {
            setError(res.error);
          }
          if (res.success) {
            setSuccess(res.success);
          }
        });

        router.push("/blog/feed/1");
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onPublish)}
      className="flex flex-col justify-between max-w-300 m-auto min-h-[85vh]"
    >
      <div>
        {!!uploadedCover && (
          <CoverIamge
            url={uploadedCover}
            isEditor={true}
            setUploadedCover={setUploadedCover}
          />
        )}
        {!uploadedCover && <AddCover setUploadedCover={setUploadedCover} />}

        <FormField
          id="title"
          register={register}
          errors={errors}
          placeholder="Blog Title"
          disabled={false}
          inputClassName="border-none text-5xl font-bold bg-transparent px-0"
        />

        <BlogFormTags register={register} />
        {errors.tags && errors.tags.message && (
          <span className="text-sm text-rose-400">
            Select at least on tag, max of 4 tag!
          </span>
        )}

        <BlockNoteEditor
          onChange={onChange}
          initialContent={blog?.content ? blog.content : ""}
        />
        {errors.content && errors.content.message && (
          <span className="text-sm text-rose-400">
            {errors.content.message}
          </span>
        )}
      </div>

      <div className="border-t pt-2">
        {errors.userId && errors.userId.message && (
          <span className="text-sm text-rose-400">Missing a userId</span>
        )}
        {success && <Alert message={success} success />}
        {error && <Alert message={error} error />}
        <div className="flex items-center justify-between gap-6">
          {blog && (
            <div>
              <Button
                onClick={handleSubmit(onDelete)}
                type="button"
                label={isDeleting ? "Deleting ..." : "Delete"}
              />
            </div>
          )}
          <div className="flex gap-4">
            <Button
              type="submit"
              label={isPublishing ? "Publishing ..." : "Publish"}
              className="bg-blue-700"
            />
            <Button
              type="button"
              label={isSavingAsDraft ? "Saving..." : "Save as Draft"}
              onClick={handleSubmit(onSaveDraft)}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreateBlogForm;
