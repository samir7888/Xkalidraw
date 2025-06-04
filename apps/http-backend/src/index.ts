import express from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";
const app = express();
import { JWT_SECRET } from "@repo/backend-common/config";
import {
  CreateUserSchema,
  SigninUserSchema,
  CreateRoomSchema,
} from "@repo/common/types";



app.get("/", (_, res) => {
  res.send("Hello World!");
});

app.post("/signup", (req, res) => {
  const data = CreateUserSchema.safeParse(req.body);
  if (!data.success) {
    res.json({
      message: "Inputs are incorrect",
    });
    return;
  }
  const userId = 1;
  const token = jwt.sign({ userId }, JWT_SECRET);
  res.json({
    token,
  });
});
app.post("/signin", (req, res) => {
  const data = SigninUserSchema.safeParse(req.body);
  if (!data.success) {
    res.json({
      message: "username or password is incorrect",
    });
    return;
  }
  res.json({
    message: "signup success",
  });
});
app.post("/room", middleware, (req, res) => {
  const data = CreateRoomSchema.safeParse(req.body);
  if (!data.success) {
    res.json({
      message: "room name is incorrect",
    });
    return;
  }
  res.json({
    message: "room created",
    roomId:123,
  });
});
app.listen(5000);
