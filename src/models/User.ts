import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    username: { type: Schema.Types.String, required: true },
    email: { type: Schema.Types.String, required: true, unique: true },
    password: { type: Schema.Types.String, required: true },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("Users", UserSchema);
