import c from "config";
import { config, decrypt } from "dotenv";
import * as jwt from "jsonwebtoken";
import { UserInterface } from "../interfaces/UserInterface";
import { ObjectId } from "mongoose";
import { User } from "../models/User";
import { UserPayload } from "../interfaces/UserPayload";

export const GetUserByToken = async (token: string) => {
  const secret = c.get<string>("secret");
  const decoded = jwt.verify(token, secret) as UserPayload;

  const id = decoded._id;

  const user = (await User.findById(id).select(
    "-password -__v"
  )) as UserPayload;

  return user;
};
