import { config } from "dotenv";
config();

const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const SECRET = process.env.SECRET;

export default {
  port: 3000,
  dbUrl: `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.gokk2cs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
  secret: SECRET,
};
