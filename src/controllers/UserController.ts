import { Request, Response } from "express";
import { UserInterface } from "../interfaces/User";
import { StatusCodes } from "http-status-codes";
import { User } from "../models/User";
import * as bcrypt from "bcryptjs";

function verifyUserData({ username, email, password }: UserInterface) {
  if (!username) {
    return new Error("Username is mandatory");
  }
  if (!email) {
    return new Error("Username is mandatory");
  }
  if (!password) {
    return new Error("Username is mandatory");
  }
}

export const createUser = async (req: Request, res: Response) => {
  const user: UserInterface = req.body;
  const confirmPassword = req.body.confirmPassword;
  const emailExists = await User.findOne({ email: user.email });

  const verifyData = verifyUserData(user);

  if (verifyData) {
    return res
      .status(StatusCodes.UNPROCESSABLE_ENTITY)
      .json({ msg: verifyData.message });
  }

  if (emailExists) {
    return res
      .status(StatusCodes.CONFLICT)
      .json({ msg: "This email is already in use" });
  }

  if (user.password !== confirmPassword) {
    return res
      .status(StatusCodes.CONFLICT)
      .json({ msg: "Passwords are not the same" });
  }

  try {
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(user.password, salt);

    const newUser = new User({
      ...user,
      password: hashPassword,
    });

    await newUser.save();
    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "User created with successfully" });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Failed to create user" });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password -__v");
    return res.status(StatusCodes.OK).json(users);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Failed to load users" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).select("-password -__v");

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "User not found" });
    }

    return res.status(StatusCodes.OK).json(user);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Failed to load user" });
  }
};
