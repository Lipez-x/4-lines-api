import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
} from "../controllers/UserController";
import { isValidId } from "../middlewares/isValidObjectId";
export const UserRoutes = Router();

UserRoutes.post("/create", createUser);
UserRoutes.get("/", getAllUsers);
UserRoutes.get("/:id", isValidId, getUserById);
