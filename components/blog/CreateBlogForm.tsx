"use client";

import { BlogSchema, BlogSchemaType } from "@/schemas/BlogSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { SubmitHandler, useForm } from "react-hook-form";
import FormField from "../common/FormField";
import AddCover from "./AddCover";
import { useEffect, useState } from "react";
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
import { useBlog } from "@/store/use-blog";
import { useDebounceValue } from "@/hooks/useDebounceValue";

const BlockNoteEditor = dynamic(() => import("./editor/BlockNoteEditor"), {
  ssr: false,
});
const CreateBlogForm = ({ blog }: { blog?: Blog }) => {
  const session = useSession();
  const userId = session.data?.user.userId;
  const router = useRouter();
  const { edgestore } = useEdgeStore();

  const draft = useBlog((s) => s.draft);
  const hasHydrated = useBlog((s) => s._hasHydrated);
  const initDraft = useBlog((s) => s.initDraft);
  const setDraftFields = useBlog((s) => s.setDraftFields);
  const publish = useBlog((s) => s.publish);
  const saveAsDraft = useBlog((s) => s.saveAsDraft);
  const deleteBlog = useBlog((s) => s.deleteBlog);
  const isPublishing = useBlog((s) => s.isPublishing);
  const isSavingDraft = useBlog((s) => s.isSavingDraft);
  const isDeleting = useBlog((s) => s.isDeleting);
  const error = useBlog((s) => s.error);
  const success = useBlog((s) => s.success);
  const resetStatus = useBlog((s) => s.resetStatus);

  const [uploadedCover, setUploadedCover] = useState<string | undefined>();

  const blogId = blog?.id ?? "new";

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
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
    if (!hasHydrated) return;

    const existingDraft = useBlog.getState().draft;

    if (existingDraft && existingDraft?.id === blogId) {
      reset({
        userId: blog?.userId ?? userId,
        isPublished: blog?.isPublished ?? false,
        title: existingDraft.title,
        content: existingDraft.content,
        coverImage: existingDraft.coverImage,
        tags: existingDraft.tags,
      });
      setUploadedCover(existingDraft.coverImage);
    } else {
      initDraft(blogId, {
        title: blog?.title ?? "",
        content: blog?.content ?? "",
        coverImage: blog?.coverImage ?? undefined,
        tags: blog?.tags ?? [],
      });
      setUploadedCover(blog?.coverImage ?? undefined);
    }
  }, [hasHydrated, blogId]);

  const watched = watch();
  const debouncedWatched = useDebounceValue(watched, 500);

  useEffect(() => {
    if (!hasHydrated) return;
    const current = useBlog.getState().draft;
    if (!current || current.id !== blogId) return;

    setDraftFields({
      title: debouncedWatched.title ?? "",
      content: debouncedWatched.content ?? "",
      coverImage: debouncedWatched.coverImage,
      tags: debouncedWatched.tags ?? [],
    });
  }, [debouncedWatched, hasHydrated, blogId]);

  useEffect(() => {
    if (uploadedCover) {
      setValue("coverImage", uploadedCover, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }, [uploadedCover]);

  const onPublish: SubmitHandler<BlogSchemaType> = async (data) => {
    resetStatus();

    if (data.tags.length > 4) {
      return;
    }

    const ok = await publish(data, blog?.id);
    if (ok) {
      router.push("/blog/feed/1");
    }
  };

  const onSaveDraft: SubmitHandler<BlogSchemaType> = async (data) => {
    resetStatus();
    if (data.tags.length > 4) return;
    await saveAsDraft(data, blog?.id);
  };

  const onDelete = async () => {
    resetStatus();
    if (!blog) return;

    if (blog.coverImage) {
      try {
        await edgestore.publicFiles.delete({ url: blog.coverImage });
      } catch {
        // ignore error
      }
    }

    const ok = await deleteBlog(blog.id);
    if (ok) router.push("/blog/feed/1");
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
          onChange={(value) => {
            setValue("content", value, {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true,
            });
          }}
          initialContent={
            useBlog.getState().draft?.id === blogId
              ? useBlog.getState().draft?.content
              : (blog?.content ?? "")
          }
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
              label={isSavingDraft ? "Saving..." : "Save as Draft"}
              onClick={handleSubmit(onSaveDraft)}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreateBlogForm;
