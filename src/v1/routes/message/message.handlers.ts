import { Request, Response } from "express";
import { KafkaService } from "../../../services";

export const messageHandler = async (req: Request, res: Response) => {
  const { sender_id, recipient_id, message } = req.body;

  const result = await KafkaService.produceMessage(
    sender_id,
    recipient_id,
    message,
  );
  res.status(202).json(result);
};

export const getAllMessagesHandler = async (req: Request, res: Response) => {
  const result = await KafkaService.getAllMessages();
  res.status(200).json(result);
};
