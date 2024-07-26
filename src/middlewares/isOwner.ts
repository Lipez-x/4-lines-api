import c from "config";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as jwt from "jsonwebtoken";
import { UserPayload } from "../interfaces/UserPayload";

export const isOwner = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Access denied" });
  }

  try {
    const secret = c.get<string>("secret");
    jwt.verify(token, secret, (err: any) => {
      if (err) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ msg: "Access denied" });
      }
    });

    const decodedToken = jwt.decode(token) as UserPayload;

    if (decodedToken.role !== "Owner") {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ msg: "The user is not owner" });
    }

    next();
  } catch (error) {}
};
