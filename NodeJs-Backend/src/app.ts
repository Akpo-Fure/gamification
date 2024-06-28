import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import logger from "morgan";
import cors from "cors";
import socketServer from "./socket/socket";
import { connectDB } from "./config";
import { authRoute } from "./routes";

const app: Application = express();
const server = socketServer(app);

dotenv.config();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.use("/api/auth", authRoute);

server.listen(process.env.PORT, () => {
  connectDB();
  console.clear();
  console.log(`Server is running on port: ${process.env.PORT}`);
});
