import { JwtPayload } from "jsonwebtoken";
import { Document } from "mongoose";

export interface UserInterface extends JwtPayload {
  username: string;
  email: string;
  password: string;
}
