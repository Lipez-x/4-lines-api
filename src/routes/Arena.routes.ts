import { Router } from "express";
import ArenaController from "../controllers/ArenaController";
import { verifyToken } from "../middlewares/verifyToken";
import { isValidId } from "../middlewares/isValidObjectId";

export const ArenaRoutes = Router();

const arenaController = new ArenaController();

ArenaRoutes.post("/create", verifyToken, arenaController.create);
ArenaRoutes.get("/", verifyToken, arenaController.getAll);
ArenaRoutes.get("/:id", verifyToken, isValidId, arenaController.getById);
