import c from "config";
import express from "express";
import { connection } from "../config/db";
import { UserRoutes } from "./routes/User.routes";
const app = express();
app.use(express.json());

app.use("/user/", UserRoutes);

const port = c.get<number>("port");

app.listen(port, () => {
  console.log(`Aplicação rodando na porta ${port}`);
  connection();
});
