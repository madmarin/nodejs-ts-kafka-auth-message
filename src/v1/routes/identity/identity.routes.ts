import { Router } from "express";
import { AuthorizationWrapper, ErrorHandlerWrapper } from "../../../utils";
import * as handlers from "./identity.handlers";

const identityRouter = Router();

/**
 * @swagger
 * /api/v1/verify:
 *   post:
 *     summary: Verify identity by scanning a document with AWS Textract
 *     tags:
 *       - Identity
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - photo
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: Image or PDF document to scan (max 10MB)
 *     responses:
 *       '200':
 *         description: Document processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: File processed successfully
 *                 result:
 *                   type: object
 *       '400':
 *         description: Missing file or unsupported file type
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
identityRouter.post(
  "/verify",
  ErrorHandlerWrapper(AuthorizationWrapper(handlers.verifyIdentityHandler)),
);

export { identityRouter };
