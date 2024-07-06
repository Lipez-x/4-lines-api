import c from "config";
import mongoose from "mongoose";

const dbUrl = c.get<string>("dbUrl");

export const connection = async () => {
  try {
    await mongoose.connect(dbUrl);
    console.log("Conectado ao banco de dados");
  } catch (error) {
    console.log(error);
  }
};
