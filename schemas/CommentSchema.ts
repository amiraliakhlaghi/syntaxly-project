import { z } from "zod";

export const CommentSchema = z.object({
  content: z
    .string()
    .min(4, { error: "comment is too short" })
    .max(500, { error: "your comment is too long, max 500 characters" }),
});

export type CommentSchemaType = z.infer<typeof CommentSchema>;
