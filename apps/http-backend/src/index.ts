import express from "express";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { middleware } from "./middleware.js";
import { JWT_SECRET } from "@repo/backend-common/config";
import {
  CreateUserSchema,
  SigninUserSchema,
  CreateRoomSchema,
} from "@repo/common/types";
import { prismaClient } from "@repo/db/client";

const app = express();
app.use(express.json());

app.get("/", (_, res) => {
  res.send("Hello World!");
});

app.post("/signup", async (req, res) => {
  const parsedData = CreateUserSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.json({
      message: "Inputs are incorrect",
      errors: parsedData.error.format(),
    });
    return;
  }
  const { email, password, name } = parsedData.data;

  const ExistedUser = await prismaClient.user.findFirst({
    where: {
      email,
      name,
    },
  });

  if (ExistedUser) {
    res.json({
      message: "username with this email already exists",
    });
    return;
  }
try {
    const user = await prismaClient.user.create({
      data: {
        email,
        password,
        name,
      },
    });
  
    res.json({
      userId: user.id,
    });
} catch (error) {
  res.status(411).json({
    message: "User already exists with this email"
  });
}
});

app.post("/signin", async (req, res) => {
  const parsedData = SigninUserSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "username or password is incorrect",
    });
    return;
  }

  const ExistedUser = await prismaClient.user.findFirst({
    where: {
      email: parsedData.data.user,
    },
  });

  if (!ExistedUser) {
    res.json({
      message: "username or password is incorrect",
    });
    return;
  }
  const token = jwt.sign(
    {
      userId: ExistedUser.id,
    },
    JWT_SECRET
  );
  res.json({
    token,
  });
});

interface AuthenticatedRequest extends Request {
  userId?: string;
}

app.post(
  "/room",
  middleware,
  async (req: AuthenticatedRequest, res: Response) => {
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.json({
        message: "room name is incorrect",
      });
      return;
    }

    const userId = req.userId;
    if (!userId) {
      return;
    }

    try {
      const room = await prismaClient.room.create({
        data: {
          slug: parsedData.data.name,
          adminId: userId,
        },
      });
      res.json({
        roomId: room.id,
      });
    } catch (error) {
      res.status(401).json({
        message: "Room already exists with this name"
      });
    }
  }
);

app.listen(5000);