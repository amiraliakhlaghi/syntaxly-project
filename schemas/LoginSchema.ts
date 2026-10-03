import { z } from "zod";

export const LoginSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(6, { error: "password must be 6 or more than characters!" }),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;
