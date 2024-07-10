import { model, Schema } from "mongoose";

const ScheduleSchema = new Schema({
  hour: { type: Schema.Types.Date, required: true },
  available: { type: Schema.Types.Boolean, required: true },
});

const ArenaSchema = new Schema(
  {
    name: { type: Schema.Types.String, required: true },
    contact: { type: Schema.Types.String, required: true },
    address: { type: Schema.Types.String, required: true },
    price: { type: Schema.Types.Number, required: true },
    description: { type: Schema.Types.String, required: true },
    schedule: { type: [ScheduleSchema] },
    owner: { type: Object, required: true },
    lessee: { type: Object },
  },
  {
    timestamps: true,
  }
);

export const Arena = model("Arenas", ArenaSchema);
