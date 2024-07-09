import { Document } from "mongoose";

export interface UserInterface extends Document {
  username: string;
  email: string;
  password: string;
}
