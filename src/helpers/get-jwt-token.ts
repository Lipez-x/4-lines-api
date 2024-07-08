import { Request } from "express";

export const GetToken = (req: Request) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1] as string;

  return token;
};
