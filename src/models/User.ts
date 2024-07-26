import mongoose, { Schema } from "mongoose";
import { Role } from "../Enums/User.enum";

const UserSchema = new Schema(
  {
    username: { type: Schema.Types.String, required: true },
    email: { type: Schema.Types.String, required: true, unique: true },
    password: { type: Schema.Types.String, required: true },
    role: { type: String, enum: Role, required: true },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("Users", UserSchema);
