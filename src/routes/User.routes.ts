import { Router } from "express";
import { isValidId } from "../middlewares/isValidObjectId";
import UserController from "../controllers/UserController";
import { verifyToken } from "../middlewares/verifyToken";
import { User } from "../models/User";
export const UserRoutes = Router();

const userController = new UserController();

UserRoutes.post("/login", userController.login);
UserRoutes.post("/create", userController.createUser);
UserRoutes.get("/", verifyToken, userController.getAllUsers);
UserRoutes.get("/:id", verifyToken, isValidId, userController.getUserById);
UserRoutes.put("/update/:id", verifyToken, isValidId, userController.update);
UserRoutes.delete("/delete/:id", verifyToken, isValidId, userController.delete);
