// import { JWT_SECRET } from "./../../../packages/backend-common/config";
import { JWT_SECRET } from "@repo/backend-common/config";
import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
// import { JWT_SECRET } from './config';
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws, request) => {
  const url = request.url;
  if (url) {
    return null;
  }
  const queryParams = new URLSearchParams(url?.split("?")[1]);
  const token = queryParams.get("token") || "";

  const decoded = jwt.verify(token, JWT_SECRET);
  if (typeof decoded === "string") {
    ws.close();
    return;
  }
  if (!decoded || !decoded.userId) {
    ws.close();
    return;
  }
  ws.on("message", (message) => {
    console.log("ping pong", message);
  });
});
