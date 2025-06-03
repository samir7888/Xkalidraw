import express from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";
const app = express();
import { JWT_SECRET } from "@repo/backend-common/config";
//todo:add zod validation

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/signin", (req, res) => {
  const { username, password } = req.body;
  const userId = 1;
  const token = jwt.sign({ userId }, JWT_SECRET);
  res.json({
    token,
  });
});
app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  res.json({
    message: "signup success",
  });
});
app.post("/room", middleware, (req, res) => {
  const { roomId } = req.body;
  res.json({
    message: "room created",
    roomId,
  });
});
app.listen(5000);
