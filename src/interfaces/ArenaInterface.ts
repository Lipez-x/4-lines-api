import { Document } from "mongoose";
import Schedule from "./Schedule";

export default interface ArenaInterface extends Document {
  name: string;
  contact: string;
  address: string;
  price: number;
  description: string;
  schedule: Schedule[];
}
