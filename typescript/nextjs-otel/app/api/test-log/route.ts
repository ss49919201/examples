import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";

export async function GET() {
  logger.info("Test log API called");

  logger.debug({
    timestamp: new Date().toISOString(),
    endpoint: "/api/test-log",
  }, "Debug log example");

  logger.warn({
    warning: "This is a warning message",
  });

  return NextResponse.json({
    message: "Logs have been sent to OpenTelemetry",
    timestamp: new Date().toISOString(),
  });
}
