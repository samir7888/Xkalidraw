import { JWT_SECRET } from "@repo/backend-common/config";
import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws, request) => {
  const url = request.url;
  if (!url) {
    ws.close();
    return;
  }
  const queryParams = new URLSearchParams(url?.split("?")[1]);
  const token = queryParams.get("token") || "";

  try {
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
  } catch (error) {
    ws.close();
    return;
  }
});