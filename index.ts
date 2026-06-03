import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import { initializeDatabase } from "./src/config";
import { identityRouter, userRouter, messageRouter } from "./src/v1/routes";
import { swaggerDocs as swaggerDocsV1 } from "./src/v1/swagger";
import KafkaService from "./src/services/kafka.service";

const bootstrap = async () => {
  const app = express();
  const port = process.env.PORT ?? "84";

  app.use(express.json());
  app.use("/api/v1", userRouter);
  app.use("/api/v1", identityRouter);
  app.use("/api/v1", messageRouter);

  app.get("/check-health", (_req, res) => {
    res.status(200).json({ message: "Api Up!", uptime: process.uptime() });
  });

  await initializeDatabase();
  await KafkaService.startConsumer();

  app.listen(port, () => {
    swaggerDocsV1(app);
    console.log(`🚀 API Running on port ${port}`);
  });
};

bootstrap();
