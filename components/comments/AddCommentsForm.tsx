"use client";

import { CommentSchema, CommentSchemaType } from "@/schemas/CommentSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../common/Button";
import TextAreaField from "../common/TextAreaField";
import { addComment } from "@/action/comments/add-comment";
import { toast } from "react-hot-toast";
import { createNotification } from "@/action/notifications/createNotification";
import { useSocket } from "@/context/SocketContext";
import { AddCommentsProps } from "@/types";

const AddCommentsForm = ({
  blogId,
  userId,
  parentId,
  repliedToId,
  placeholder,
  creatorId,
}: AddCommentsProps) => {
  const [isPending, startTransition] = useTransition();
  const { sendNotification } = useSocket();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CommentSchemaType>({
    resolver: zodResolver(CommentSchema),
  });

  const onSubmit: SubmitHandler<CommentSchemaType> = (data) => {
    startTransition(() => {
      addComment({
        values: data,
        userId,
        blogId,
        parentId,
        repliedToUserId: repliedToId,
      }).then(async (res) => {
        if (res.error) return toast.error(res.error);

        if (res.success) {
          if (repliedToId) {
            const notif = await createNotification({
              recipientId: repliedToId,
              type: "COMMENT_REPLY",
              commentId: parentId,
              entityType: "COMMENT",
              content: data.content,
            });

            sendNotification(repliedToId);
          }

          if (creatorId) {
            const notif = await createNotification({
              recipientId: creatorId,
              type: "NEW_COMMENT",
              blogId,
              entityType: "BLOG",
              content: data.content,
            });

            sendNotification(creatorId);
          }

          toast.success(res.success);
          reset();
        }
      });
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col my-2">
      <TextAreaField
        id="content"
        register={register}
        errors={errors}
        placeholder={placeholder ? placeholder : "Add Comment"}
        disabled={isPending}
      />
      <div>
        <Button
          type="submit"
          label={isPending ? "Submiting ..." : "Submit"}
          disabled={isPending}
        />
      </div>
    </form>
  );
};

export default AddCommentsForm;
