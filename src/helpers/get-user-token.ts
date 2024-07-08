import c from "config";
import { config, decrypt } from "dotenv";
import * as jwt from "jsonwebtoken";
import { UserInterface } from "../interfaces/User";
import { ObjectId } from "mongoose";
import { User } from "../models/User";

export const GetUserByToken = async (token: string) => {
  const secret = c.get<string>("secret");
  const decoded = jwt.verify(token, secret) as UserInterface;

  const email = decoded.email;

  const user = await User.findOne({ email: email }).select("-password -__v");

  return user;
};
