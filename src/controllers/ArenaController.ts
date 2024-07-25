import { Request, Response } from "express";
import ArenaInterface from "../interfaces/ArenaInterface";
import { StatusCodes } from "http-status-codes";
import { GetToken } from "../helpers/get-jwt-token";
import { GetUserByToken } from "../helpers/get-user-token";
import { Arena } from "../models/Arena";
import moment from "moment";
import { User } from "../models/User";
import { Types } from "mongoose";
import { UserPayload } from "../interfaces/UserPayload";
import { scheduler } from "timers/promises";

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
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: "Failed to create arena" });
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

  async requestRent(req: Request, res: Response) {
    const id = req.params.id;
    const hourId = req.params.hourId;

    const arena = await Arena.findById(id);

    if (!arena) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "Arena not found" });
    }

    try {
      const token = GetToken(req);
      const userByToken = await GetUserByToken(token);

      const user = new User(userByToken);

      const availableSchedule = arena.schedule.map((schedule) => {
        if (schedule._id?.equals(hourId) && schedule.available === false) {
          return false;
        }
        return true;
      });

      if (availableSchedule.includes(false)) {
        return res
          .status(StatusCodes.FORBIDDEN)
          .json({ msg: "This schedule is not available" });
      }

      const requestAlreadySend = arena.schedule.map((schedule) => {
        if (schedule.lessee.some((schedule) => schedule._id.equals(user._id))) {
          return false;
        }
        return true;
      });

      if (requestAlreadySend.includes(false)) {
        return res
          .status(StatusCodes.FORBIDDEN)
          .json({ msg: "Request already send" });
      }

      const newSchedule = arena.schedule.map((schedule) => {
        if (schedule.id === hourId) {
          schedule.lessee.push(user);
          return true;
        }
        return false;
      });

      if (!newSchedule.includes(true)) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ msg: "Schedule is not found" });
      }

      const arenaUpdate = {
        ...arena,
        schedule: newSchedule,
      };

      await Arena.findByIdAndUpdate(id, arenaUpdate);
      return res
        .status(StatusCodes.OK)
        .json({ msg: `Request sent, send a message from: ${arena.contact}` });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: "Failed to request rent" });
    }
  }

  async acceptRequest(req: Request, res: Response) {
    const id = req.params.id;
    const hourId = req.params.hourId;
    const lesseeId = req.params.lesseeId;

    const arena = await Arena.findById(id);

    if (!arena) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "Arena not found" });
    }

    const token = GetToken(req);
    const user = await GetUserByToken(token);

    const owner = await User.findById(arena.owner._id);
    if (user.id !== owner?.id) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ msg: "You don't have access" });
    }

    try {
      const acceptHour = arena.schedule.map((schedule) => {
        if (schedule.id === hourId) {
          schedule.available = false;
          const lesseeAccepted = schedule.lessee.filter(
            (lessee) => lessee.id === lesseeId
          );

          if (lesseeAccepted.length === 0) {
            return false;
          }
          schedule.lessee = lesseeAccepted as Types.DocumentArray<UserPayload>;
          return true;
        }
        return false;
      });

      if (!acceptHour.includes(true)) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ msg: "Schedule is not found" });
      }

      const arenaUpdate = {
        ...arena,
        schedule: acceptHour,
      };

      await Arena.findByIdAndUpdate(id, arenaUpdate);

      return res
        .status(StatusCodes.OK)
        .json({ msg: "Request successfully accepted" });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: "Failed to accept request" });
    }
  }

  async completeRental(req: Request, res: Response) {
    const id = req.params.id;
    const hourId = req.params.hourId;

    const arena = await Arena.findById(id);

    if (!arena) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "Arena not found" });
    }

    const token = GetToken(req);
    const user = await GetUserByToken(token);

    const owner = await User.findById(arena.owner._id);

    if (user.id !== owner?.id) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ msg: "You don't have access" });
    }

    try {
      const verifySchema = arena.schedule.map((schedule) => {
        if (schedule.id === hourId) {
          schedule.available = true;
          schedule.lessee.length = 0;
          return true;
        }
        return false;
      });

      if (!verifySchema.includes(true)) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ msg: "Schedule is not found" });
      }

      const updateArena = {
        ...arena,
        schedule: verifySchema,
      };

      await Arena.findByIdAndUpdate(id, updateArena);
      return res
        .status(StatusCodes.OK)
        .json({ msg: "Rental completed successfully" });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: "Failed to complete " });
    }
  }

  async update(req: Request, res: Response) {
    const id = req.params.id;
    const data: ArenaInterface = req.body;

    const verifyData = verifyArenaData(data);

    if (verifyData) {
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({ msg: verifyData.message });
    }

    const arena = await Arena.findById(id);

    if (!arena) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "Arena not found" });
    }

    const isValidDate = (date: string) => {
      return moment(date, moment.ISO_8601, true).isValid();
    };

    const verifyHours = data.schedule.map((schedule) => {
      return isValidDate(schedule.hour);
    });

    if (verifyHours.includes(false)) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ msg: "The time needs to be a date" });
    }

    try {
      const token = GetToken(req);
      const user = await GetUserByToken(token);

      const owner = await User.findById(arena.owner._id);

      if (user.id !== owner?.id) {
        return res
          .status(StatusCodes.FORBIDDEN)
          .json({ msg: "You don't have access" });
      }

      const arenaUpdate = {
        ...data,
        owner: user,
      };

      await Arena.findByIdAndUpdate(id, arenaUpdate);
      return res
        .status(StatusCodes.OK)
        .json({ msg: "Arena updated successfully" });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: "Failed to update arena" });
    }
  }

  async delete(req: Request, res: Response) {
    const id = req.params.id;
    const arena = await Arena.findById(id);

    if (!arena) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "Arena not found" });
    }

    try {
      const token = GetToken(req);
      const user = await GetUserByToken(token);
      const owner = await User.findById(arena.owner._id);

      if (user.id !== owner?.id) {
        return res
          .status(StatusCodes.FORBIDDEN)
          .json({ msg: "You don't have access" });
      }

      await Arena.findByIdAndDelete(id);
      return res
        .status(StatusCodes.OK)
        .json({ msg: "Arena deleted successfully" });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: "Failed to delete arena" });
    }
  }
}
