import { Router } from "express";
import ArenaController from "../controllers/ArenaController";
import { verifyToken } from "../middlewares/verifyToken";
import { isValidId } from "../middlewares/isValidObjectId";
import { Arena } from "../models/Arena";

export const ArenaRoutes = Router();

const arenaController = new ArenaController();

ArenaRoutes.post("/create", verifyToken, arenaController.create);
ArenaRoutes.get("/", verifyToken, arenaController.getAll);
ArenaRoutes.get("/myarenas", verifyToken, arenaController.getAllUserArenas);
ArenaRoutes.get("/:id", verifyToken, isValidId, arenaController.getById);
ArenaRoutes.put(
  "/:id/:hourId",
  verifyToken,
  isValidId,
  arenaController.requestRent
);
ArenaRoutes.put("/update/:id", verifyToken, isValidId, arenaController.update);
ArenaRoutes.delete(
  "/delete/:id",
  verifyToken,
  isValidId,
  arenaController.delete
);
