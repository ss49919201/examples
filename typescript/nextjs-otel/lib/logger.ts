import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: {
    targets: [
      {
        target: "pino-opentelemetry-transport",
        options: {
          resourceAttributes: {
            "service.name": "next-app",
          },
          loggerName: "next-app-logger",
        },
        level: "info",
      },
      {
        target: "pino/file",
        options: {
          destination: 1, // stdout
        },
        level: "info",
      },
    ],
  },
});
