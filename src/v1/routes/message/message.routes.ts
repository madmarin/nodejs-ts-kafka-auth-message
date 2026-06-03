import { Router } from "express";
import { AuthorizationWrapper, ErrorHandlerWrapper } from "../../../utils";
import * as handlers from "./message.handlers";

const messageRouter = Router();

/**
 * @swagger
 * /api/v1/message:
 *   post:
 *     summary: Send a message via Kafka
 *     tags:
 *       - Messages
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sender_id
 *               - recipient_id
 *               - message
 *             properties:
 *               sender_id:
 *                 type: string
 *                 description: UUID of the sender user
 *               recipient_id:
 *                 type: string
 *                 description: UUID of the recipient user
 *               message:
 *                 type: string
 *                 description: Message content
 *     responses:
 *       '200':
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Message sending successfully
 *                 at:
 *                   type: string
 *                   format: date-time
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
messageRouter.post(
  "/message",
  ErrorHandlerWrapper(AuthorizationWrapper(handlers.messageHandler)),
);

/**
 * @swagger
 * /api/v1/message:
 *   get:
 *     summary: Get all messages
 *     tags:
 *       - Messages
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: List of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: object
 *                   properties:
 *                     messages:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           message_id:
 *                             type: string
 *                           message_message:
 *                             type: string
 *                           message_created_time:
 *                             type: string
 *                             format: date-time
 *                           sender_id:
 *                             type: string
 *                           recipient_id:
 *                             type: string
 *                 success:
 *                   type: boolean
 *       '401':
 *         description: Unauthorized
 */
messageRouter.get(
  "/message",
  ErrorHandlerWrapper(AuthorizationWrapper(handlers.getAllMessagesHandler)),
);

export { messageRouter };
