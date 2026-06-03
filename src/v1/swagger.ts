import * as dotenv from "dotenv";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import { Application } from "express";

dotenv.config();

const buildOptions = () => {
  const port = process.env.PORT ?? "84";
  return {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "API Cyclia Documentation",
        version: "1.0.0",
        description:
          "Bienvenido a la documentación de la API Cyclia. Esta exhaustiva guía proporciona una visión detallada de todos los aspectos de nuestra API, desde la autenticación hasta la gestión de mensajes y usuarios. Diseñada con la claridad y la accesibilidad en mente, nuestra documentación está estructurada de manera lógica y fácil de seguir, lo que permite a los desarrolladores encontrar rápidamente la información que necesitan para integrar y utilizar eficazmente nuestros servicios.",
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [{ bearerAuth: [] }],
      servers: [
        {
          url: `http://localhost:${port}`,
          description: "Local development server",
        },
      ],
    },
    apis: [
      "src/v1/routes/user/user.routes.ts",
      "src/v1/routes/message/message.routes.ts",
      "src/v1/routes/identity/identity.routes.ts",
    ],
  };
};

export const swaggerDocs = (app: Application) => {
  const port = process.env.PORT ?? "84";
  const swaggerSpec = swaggerJSDoc(buildOptions());
  app.use("/api/v1/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
  console.info(
    "🔗 Swagger Documentation:",
    decodeURI(`\x1b[36mhttp://localhost:${port}/api/v1/docs\x1b[0m`),
  );
};
