import { Router } from "express";
import { isValidId } from "../middlewares/isValidObjectId";
import UserController from "../controllers/UserController";
import { verifyToken } from "../middlewares/verifyToken";
export const UserRoutes = Router();

const userController = new UserController();

UserRoutes.post("/login", userController.login);
UserRoutes.post("/create", userController.createUser);
UserRoutes.get("/", verifyToken, userController.getAllUsers);
UserRoutes.get("/:id", verifyToken, isValidId, userController.getUserById);
