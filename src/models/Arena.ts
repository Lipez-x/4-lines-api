import { model, Schema } from "mongoose";

const ArenaSchema = new Schema(
  {
    name: { type: Schema.Types.String, required: true },
    contact: { type: Schema.Types.String, required: true },
    address: { type: Schema.Types.String, required: true },
    price: { type: Schema.Types.Number, required: true },
    description: { type: Schema.Types.String, required: true },
    hours: { type: Schema.Types.Array },
  },
  {
    timestamps: true,
  }
);

export const Arena = model("Arenas", ArenaSchema);
