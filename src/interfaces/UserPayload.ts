import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";

export interface UserPayload extends JwtPayload {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
}
