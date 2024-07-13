import { model, Schema } from "mongoose";

const UserSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true },
  username: { type: Schema.Types.String, required: true },
  email: { type: Schema.Types.String, required: true },
  createdAt: { type: Schema.Types.Date, required: true },
  updatedAt: { type: Schema.Types.Date },
});

const ScheduleSchema = new Schema({
  hour: { type: Schema.Types.Date, required: true },
  available: { type: Schema.Types.Boolean, required: true },
  lessee: { type: [UserSchema], default: [] },
});

const ArenaSchema = new Schema(
  {
    name: { type: Schema.Types.String, required: true },
    contact: { type: Schema.Types.String, required: true },
    address: { type: Schema.Types.String, required: true },
    price: { type: Schema.Types.Number, required: true },
    description: { type: Schema.Types.String, required: true },
    schedule: { type: [ScheduleSchema] },
    owner: { type: UserSchema, required: true },
  },
  {
    timestamps: true,
  }
);

export const Arena = model("Arenas", ArenaSchema);
