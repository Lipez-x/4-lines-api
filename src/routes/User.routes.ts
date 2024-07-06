import { Router } from "express";
import { isValidId } from "../middlewares/isValidObjectId";
import UserController from "../controllers/UserController";
export const UserRoutes = Router();

const userController = new UserController();

UserRoutes.post("/create", userController.createUser);
UserRoutes.get("/", userController.getAllUsers);
UserRoutes.get("/:id", isValidId, userController.getUserById);
