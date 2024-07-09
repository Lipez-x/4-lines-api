import { Router } from "express";
import ArenaController from "../controllers/ArenaController";

export const ArenaRoutes = Router();

const arenaController = new ArenaController();
