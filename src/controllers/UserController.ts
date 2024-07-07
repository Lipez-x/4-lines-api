import { Request, Response } from "express";
import { UserInterface } from "../interfaces/User";
import { StatusCodes } from "http-status-codes";
import { User } from "../models/User";
import * as bcrypt from "bcryptjs";
import { Login } from "../interfaces/Login.interface";
import * as jwt from "jsonwebtoken";
import { config } from "dotenv";
import c from "config";
import { getUserByToken } from "../helpers/get-user-token";
import { getToken } from "../helpers/get-jwt-token";
import { userInfo } from "os";
config();

async function verifyUserByEmail(email: string) {
  const user = await User.findOne({ email: email });
}

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
export default class UserController {
  async login(req: Request, res: Response) {
    const { email, password }: Login = req.body;

    if (!email || !password) {
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({ msg: "Email and password are required" });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "User is not found" });
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Invalid password" });
    }

    try {
      const secret = c.get<string>("secret");
      const options: jwt.SignOptions = {
        expiresIn: "1d",
      };
      const token = jwt.sign(
        { username: user.username, email: user.email, password: user.password },
        secret,
        options
      );
      res.status(StatusCodes.OK).json({
        jwt_token: token,
      });
    } catch (error) {
      console.log(error);

      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: "Failed to login" });
    }
  }

  async createUser(req: Request, res: Response) {
    const user: UserInterface = req.body;
    const confirmPassword: string = req.body.confirmPassword;
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
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await User.find().select("-password -__v");
      return res.status(StatusCodes.OK).json(users);
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: "Failed to load users" });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const user = await User.findById(id).select("-password -__v");

      if (!user) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ msg: "User not found" });
      }

      return res.status(StatusCodes.OK).json(user);
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: "Failed to load user" });
    }
  }

  async update(req: Request, res: Response) {
    const id = req.params.id;
    const data: UserInterface = req.body;
    const confirmPassword: string = req.body.confirmPassword;

    const user = await User.findById(id);

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "User not found" });
    }

    const verifyData = verifyUserData(data);

    if (verifyData) {
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({ msg: verifyData.message });
    }

    const emailExists = await User.findOne({ email: data.email });

    if (emailExists && emailExists.email !== user.email) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ msg: "This email is already in use" });
    }
    if (data.password !== confirmPassword) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ msg: "Passwords are not the same" });
    }

    try {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(data.password, salt);
      const updateUser = {
        ...data,
        password: hashedPassword,
      };

      await User.findByIdAndUpdate(id, updateUser);
      return res
        .status(StatusCodes.OK)
        .json({ msg: "User updated successfully" });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: "Failed to updated user" });
    }
  }
}
