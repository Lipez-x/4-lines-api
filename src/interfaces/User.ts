import { JwtPayload } from "jsonwebtoken";

export interface UserInterface extends JwtPayload {
  username: string;
  email: string;
  password: string;
}
