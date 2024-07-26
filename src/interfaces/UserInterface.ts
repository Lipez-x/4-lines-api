import { Document } from "mongoose";
import { Role } from "../Enums/User.enum";

export interface UserInterface extends Document {
  username: string;
  email: string;
  password: string;
  role: Role;
}
