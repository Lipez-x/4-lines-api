import c from "config";
import { config, decrypt } from "dotenv";
import * as jwt from "jsonwebtoken";
import { UserInterface } from "../interfaces/User";
import { ObjectId } from "mongoose";
import { User } from "../models/User";

export const getUserByToken = async (token: string) => {
  if (!token) {
    return new Error("Access denied");
  }

  const secret = c.get<string>("secret");
  const decoded = jwt.verify(token, secret) as UserInterface;

  const id: ObjectId = decoded.id;

  const user = await User.findById(id).select("-password -__v");

  return user;
};
