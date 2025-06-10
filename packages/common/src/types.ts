import { z } from "zod";

export const CreateUserSchema = z.object({
    email: z.string().email(),
    password: z.string(),
    name: z.string(),
});

export type CreateUser = z.infer<typeof CreateUserSchema>;

export const SigninUserSchema = z.object({
  user: z.string(),
  password: z.string(),
  name: z.string(),
});

export type LoginUser = z.infer<typeof SigninUserSchema>;

export const CreateRoomSchema = z.object({
  name: z.string(),
});

export type CreateRoom = z.infer<typeof CreateRoomSchema>;