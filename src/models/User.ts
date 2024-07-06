import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    username: { type: Schema.Types.String, require: true },
    email: { type: Schema.Types.String, require: true, unique: true },
    password: { type: Schema.Types.String, require: true },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("Users", UserSchema);
