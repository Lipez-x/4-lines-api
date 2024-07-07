import c from "config";
import express from "express";
import { connection } from "../config/db";
import { UserRoutes } from "./routes/User.routes";
const app = express();
import crypo from "crypto";
app.use(express.json());

const secret = crypo.randomBytes(32).toString("hex");

app.use("/user/", UserRoutes);

const port = c.get<number>("port");

app.listen(port, () => {
  console.log(secret);

  console.log(`Aplicação rodando na porta ${port}`);
  connection();
});
