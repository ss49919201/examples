import { configure, getLogger } from "@logtape/logtape";
import path from "path";

const logDir = path.join(process.cwd(), "logs");

// Configure LogTape
configure({
  sinks: {
    console: (record) => {
      console.log(`[${record.level}] ${record.message}`);
    },
    file: (record) => {
      const fs = require('fs');
      const logEntry = JSON.stringify({
        timestamp: record.timestamp,
        level: record.level,
        message: record.message,
        category: record.category
      });
      fs.appendFileSync(path.join(logDir, 'logtape.log'), logEntry + '\n');
    }
  },
  loggers: [
    {
      category: "logtape-test",
      level: "debug",
      sinks: ["console", "file"],
    },
  ],
});

const logger = getLogger("logtape-test");

function testBasicLogging() {
  console.log("=== LogTape Basic Logging Test ===");
  logger.fatal("This is a fatal message");
  logger.error("This is an error message");
  logger.warn("This is a warning message");
  logger.info("This is an info message");
  logger.debug("This is a debug message");
}

function testLoggingWithMetadata() {
  console.log("\n=== LogTape Logging with Metadata Test ===");
  logger.info("User login", { userId: 12345, ip: "192.168.1.1" });
  logger.error("Database connection failed", {
    database: "users",
    error: "Connection timeout",
    retries: 3,
  });
}

function testCategoryLogger() {
  console.log("\n=== LogTape Category Logger Test ===");

  const authLogger = getLogger("logtape-test.auth");
  const dbLogger = getLogger("logtape-test.database");

  authLogger.info("User authentication started");
  dbLogger.warn("Database connection slow");
  authLogger.error("Authentication failed");
}

function testConditionalLogging() {
  console.log("\n=== LogTape Conditional Logging Test ===");

  const debugCondition = process.env.NODE_ENV === "development";

  // Check if debug logging would be enabled (simplified check)
  try {
    logger.debug("Debug logging test");
    console.log("Debug logging is enabled");
  } catch {
    console.log("Debug logging is disabled");
  }

  if (debugCondition) {
    logger.debug("Development mode debug message");
  } else {
    logger.info("Production mode - debug disabled");
  }
}

function testStructuredLogging() {
  console.log("\n=== LogTape Structured Logging Test ===");

  const requestContext = {
    requestId: "req-123",
    userId: "user-456",
    operation: "getUserProfile",
  };

  logger.info("Request started", requestContext);
  logger.warn("Slow operation detected", {
    ...requestContext,
    duration: 5000,
  });
  logger.info("Request completed", {
    ...requestContext,
    statusCode: 200,
  });
}

function testPerformanceLogging() {
  console.log("\n=== LogTape Performance Logging Test ===");

  const start = Date.now();

  for (let i = 0; i < 1000; i++) {
    logger.debug(`Performance test message ${i}`);
  }

  const end = Date.now();
  logger.info(`Logged 1000 messages in ${end - start}ms`);
}

async function runAllTests() {
  try {
    testBasicLogging();
    testLoggingWithMetadata();
    testCategoryLogger();
    testConditionalLogging();
    testStructuredLogging();
    testPerformanceLogging();

    console.log("\n=== LogTape tests completed ===");
  } catch (error) {
    logger.error("Test execution failed", {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

runAllTests();

export { logger, runAllTests };
