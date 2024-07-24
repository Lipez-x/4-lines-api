import c from "config";
import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocumentEn from "./swagger.json";
import swaggerDocumentBr from "./swagger-pt-br.json";
import { connection } from "../config/db";
import { UserRoutes } from "./routes/User.routes";
import { ArenaRoutes } from "./routes/Arena.routes";
const app = express();
app.use(express.json());

app.use(
  "/api-docs/en",
  swaggerUi.serveFiles(swaggerDocumentEn),
  swaggerUi.setup(swaggerDocumentEn)
);
app.use(
  "/api-docs/br",
  swaggerUi.serveFiles(swaggerDocumentBr),
  swaggerUi.setup(swaggerDocumentBr)
);

app.use("/user/", UserRoutes);
app.use("/arena/", ArenaRoutes);

const port = c.get<number>("port");

app.listen(port, () => {
  console.log(`Aplicação rodando na porta ${port}`);
  connection();
});
