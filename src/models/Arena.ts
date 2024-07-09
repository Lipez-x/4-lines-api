import { model, Schema } from "mongoose";

const ArenaSchema = new Schema(
  {
    name: { type: Schema.Types.String, required: true },
    contact: { type: Schema.Types.String, required: true },
    address: { type: Schema.Types.String, required: true },
    price: { type: Schema.Types.Number, required: true },
    description: { type: Schema.Types.String, required: true },
    schedule: { type: Schema.Types.Array, required: true },
    owner: { type: Object, required: true },
    lessee: { type: Object },
  },
  {
    timestamps: true,
  }
);

export const Arena = model("Arenas", ArenaSchema);
