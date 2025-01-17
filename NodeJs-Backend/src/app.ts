import express, { Application, NextFunction, Request, Response } from "express";
import logger from "morgan";
import cors from "cors";
import apiRoutes from "./routes";
import { config } from "dotenv";
import { errorHandler } from "./middlewares";
import { socketServer } from "./socket";
import { connectDB } from "./config";
import { IError } from "./interfaces";

const app: Application = express();
const server = socketServer(app);

config();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);

app.use(logger("dev"));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to NodeJs Backend",
  });
});

app.use("/api", apiRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  const error: IError = new Error("API Endpoint Not found");
  error.status = 404;
  next(error);
});

app.use(errorHandler);
if (!module.parent) {
  server.listen(process.env.PORT, async () => {
    await connectDB();
    console.clear();
    console.log(`Server is running on port: ${process.env.PORT}`);
  });
}

export default server;
