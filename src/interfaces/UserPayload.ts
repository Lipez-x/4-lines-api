import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";
import { Role } from "../Enums/User.enum";

export interface UserPayload extends JwtPayload {
  _id: Types.ObjectId;
  username: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}
