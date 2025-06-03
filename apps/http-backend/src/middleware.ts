import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "@repo/backend-common/config";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const middleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === "string") {
      return;
    }
    if (!decoded || !decoded.userId) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({
      message: "Unauthorized",
    });
  }
};
