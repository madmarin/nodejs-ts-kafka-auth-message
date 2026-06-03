import { Partitioners } from "kafkajs";
import { kafka } from "../utils";
import { JwtService } from "./shared/jwt.service";
import { dataSource } from "../config";
import { Message } from "../entities";

const MESSAGE_TOPIC = "message";
const CONSUMER_GROUP = "cyclia-message-consumer";

interface MessagePayload {
  sender_id: string;
  recipient_id: string;
  message: string;
}

export default class KafkaService extends JwtService {
  private static readonly messageRepository = dataSource.getRepository(Message);

  static produceMessage = async (
    sender_id: string,
    recipient_id: string,
    message: string,
  ) => {
    const producer = kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner,
    });

    await producer.connect();
    try {
      const payload: MessagePayload = { sender_id, recipient_id, message };

      await producer.send({
        topic: MESSAGE_TOPIC,
        messages: [
          {
            key: `message-${Date.now()}`,
            value: JSON.stringify(payload),
          },
        ],
      });

      return { message: "Message queued successfully" };
    } finally {
      await producer.disconnect();
    }
  };

  static startConsumer = async () => {
    const consumer = kafka.consumer({ groupId: CONSUMER_GROUP });
    await consumer.connect();
    await consumer.subscribe({ topic: MESSAGE_TOPIC, fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ message }) => {
        try {
          if (!message.value) return;

          const payload: MessagePayload = JSON.parse(message.value.toString());

          const newMessage = new Message();
          newMessage.sender_id = payload.sender_id as any;
          newMessage.recipient_id = payload.recipient_id as any;
          newMessage.message = payload.message;

          await this.messageRepository.save(newMessage);
        } catch (error) {
          if (error instanceof Error) {
            console.error("Consumer error processing message:", error.message);
          }
        }
      },
    });

    console.log("✅ Kafka consumer running on topic:", MESSAGE_TOPIC);
  };

  static getAllMessages = async () => {
    try {
      const messages = await this.messageRepository
        .createQueryBuilder("message")
        .select([
          "message.id",
          "message.message",
          "message.created_time",
          "sender.id AS sender_id",
          "recipient.id AS recipient_id",
        ])
        .leftJoin("message.sender_id", "sender")
        .leftJoin("message.recipient_id", "recipient")
        .orderBy("message.created_time", "DESC")
        .getRawMany();

      return {
        response: { messages },
        success: true,
      };
    } catch (error) {
      if (error instanceof Error) {
        console.log("Get all messages error, reason: ", error.message);
        throw error;
      }
    }
  };
}
