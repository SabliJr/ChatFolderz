import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import { PORT } from "./Constants";
import router from "./routes/appRoutes";
import { IncomingMessage, ServerResponse } from "http";

// For env File
dotenv.config();

const app: Application = express();

declare module "http" {
  interface IncomingMessage {
    rawBody?: Buffer;
  }
}

const corsOptions = {
  credentials: true,
  origin: [
    "chrome-extension://bmnpndlhkakekmejcnnmingbehdgjboc", // Allow your extension to make requests
    "localhost:3000", // Uncomment for local development
    "http://localhost:3000", // Uncomment for local development
    "https://www.api.chatfolderz.com/",
    "www.api.chatfolderz.com/",
  ],
  optionsSuccessStatus: 204,
  exposedHeaders: ["Set-Cookie", "ajax_redirect"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Origin",
    "X-Requested-With",
    "Accept",
    "XMLHttpRequest",
  ],
};

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  bodyParser.json({
    verify: (req: IncomingMessage, res: ServerResponse, buf: Buffer) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.json());

app.use(cors(corsOptions));

// Routes
app.use(router);

app.listen(PORT, () => {
  console.log(`Server is Fire at http://localhost:${PORT}`);
});
