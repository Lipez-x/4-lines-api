import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { isValidObjectId } from "mongoose";

export const isValidId = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;

  if (!isValidObjectId(id)) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "Not found" });
  }

  next();
};
