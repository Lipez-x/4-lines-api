import { Router } from "express";
import ArenaController from "../controllers/ArenaController";
import { verifyToken } from "../middlewares/verifyToken";
import { isValidId } from "../middlewares/isValidObjectId";
import { isOwner } from "../middlewares/isOwner";
import { isClient } from "../middlewares/isClient";

export const ArenaRoutes = Router();

const arenaController = new ArenaController();

ArenaRoutes.post("/create", verifyToken, isOwner, arenaController.create);
ArenaRoutes.get("/", verifyToken, arenaController.getAll);
ArenaRoutes.get(
  "/myarenas",
  verifyToken,
  isOwner,
  arenaController.getAllUserArenas
);
ArenaRoutes.get(
  "/:id",
  verifyToken,
  isValidId,
  isOwner,
  arenaController.getById
);
ArenaRoutes.put(
  "/:id/:hourId",
  verifyToken,
  isValidId,
  isClient,
  arenaController.requestRent
);
ArenaRoutes.put(
  "/accept/:id/:hourId/:lesseeId",
  verifyToken,
  isValidId,
  isOwner,
  arenaController.acceptRequest
);
ArenaRoutes.put(
  "/complete/:id/:hourId",
  verifyToken,
  isValidId,
  isOwner,
  arenaController.completeRental
);
ArenaRoutes.put(
  "/update/:id",
  verifyToken,
  isValidId,
  isOwner,
  arenaController.update
);
ArenaRoutes.delete(
  "/delete/:id",
  verifyToken,
  isValidId,
  isOwner,
  arenaController.delete
);
