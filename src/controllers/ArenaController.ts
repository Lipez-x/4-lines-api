import { Request, Response } from "express";
import ArenaInterface from "../interfaces/ArenaInterface";
import { StatusCodes } from "http-status-codes";
import { GetToken } from "../helpers/get-jwt-token";
import { GetUserByToken } from "../helpers/get-user-token";
import { Arena } from "../models/Arena";
import moment from "moment";
import { UserPayload } from "../interfaces/UserPayload";

function verifyArenaData({
  name,
  contact,
  address,
  price,
  description,
  schedule,
}: ArenaInterface) {
  if (!name) {
    return new Error("The name of the arena is mandatory");
  }
  if (!contact) {
    return new Error("Contact is mandatory");
  }
  if (!address) {
    return new Error("The address of the arena is mandatory");
  }
  if (!price) {
    return new Error("Price is mandatory");
  }
  if (!description) {
    return new Error("Description is mandatory");
  }
  if (!schedule) {
    return new Error("Schedules are mandatory");
  }
}

export default class ArenaController {
  async create(req: Request, res: Response) {
    const data: ArenaInterface = req.body;

    const verifyData = verifyArenaData(data);

    if (verifyData) {
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({ msg: verifyData.message });
    }

    const isValidDate = (date: string) => {
      return moment(date, moment.ISO_8601, true).isValid();
    };

    const verifyHours = data.schedule.map((schedule) => {
      const validDate = isValidDate(schedule.hour);
      if (!validDate) {
        return false;
      }
      return true;
    });

    if (verifyHours.includes(false)) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ msg: "The time needs to be a date" });
    }

    try {
      const token = GetToken(req);
      const user = await GetUserByToken(token);

      const arena = new Arena({
        ...data,
        owner: user,
      });

      await arena.save();
      return res
        .status(StatusCodes.CREATED)
        .json({ msg: "Arena created with successfully" });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const arenas = await Arena.find();
      return res.status(StatusCodes.OK).json(arenas);
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: "Failed to load arenas" });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const arena = await Arena.findById(id);

      if (!arena) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ msg: "Arena not found" });
      }
      return res.status(StatusCodes.OK).json(arena);
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: "Failed to load arena" });
    }
  }

  async getAllUserArenas(req: Request, res: Response) {
    const token = GetToken(req);
    const user = await GetUserByToken(token);

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "User not found" });
    }

    try {
      const arenas = await Arena.find({ "owner._id": user._id });
      return res.status(StatusCodes.OK).json(arenas);
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: "Failed to load arenas" });
    }
  }
}
