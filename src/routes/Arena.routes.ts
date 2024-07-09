import { Router } from "express";
import ArenaController from "../controllers/ArenaController";
import { verifyToken } from "../middlewares/verifyToken";

export const ArenaRoutes = Router();

const arenaController = new ArenaController();

ArenaRoutes.post("/create", verifyToken, arenaController.create);
ArenaRoutes.get("/", verifyToken, arenaController.getAll);
