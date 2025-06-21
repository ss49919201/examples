import path from "path";
import winston from "winston";

const logDir = path.join(process.cwd(), "logs");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: "winston-test" },
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

function testBasicLogging() {
  console.log("=== Basic Logging Test ===");
  logger.error("This is an error message");
  logger.warn("This is a warning message");
  logger.info("This is an info message");
  logger.debug("This is a debug message");
}

function testLoggingWithMetadata() {
  console.log("\n=== Logging with Metadata Test ===");
  logger.info("User login", { userId: 12345, ip: "192.168.1.1" });
  logger.error("Database connection failed", {
    database: "users",
    error: "Connection timeout",
    retries: 3,
  });
}

function testCustomFormatter() {
  console.log("\n=== Custom Formatter Test ===");

  const customLogger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message} ${
          Object.keys(meta).length ? JSON.stringify(meta) : ""
        }`;
      })
    ),
    transports: [new winston.transports.Console()],
  });

  customLogger.info("Custom formatted message", { feature: "custom-format" });
}

function testMultipleTransports() {
  console.log("\n=== Multiple Transports Test ===");

  const multiLogger = winston.createLogger({
    level: "debug",
    format: winston.format.json(),
    transports: [
      new winston.transports.Console({
        level: "info",
        format: winston.format.simple(),
      }),
      new winston.transports.File({
        filename: path.join(logDir, "debug.log"),
        level: "debug",
      }),
    ],
  });

  multiLogger.debug("Debug message (only in file)");
  multiLogger.info("Info message (console and file)");
  multiLogger.error("Error message (console and file)");
}

function testChildLogger() {
  console.log("\n=== Child Logger Test ===");

  const childLogger = logger.child({
    requestId: "req-123",
    userId: "user-456",
  });

  childLogger.info("Processing request");
  childLogger.warn("Slow query detected");
  childLogger.error("Request failed");
}

function testLogLevels() {
  console.log("\n=== Log Levels Test ===");

  const levels = ["error", "warn", "info", "http", "verbose", "debug", "silly"];

  levels.forEach((level) => {
    const testLogger = winston.createLogger({
      level: level,
      format: winston.format.simple(),
      transports: [new winston.transports.Console()],
    });

    console.log(`\nTesting with level: ${level}`);
    testLogger.error("Error message");
    testLogger.warn("Warning message");
    testLogger.info("Info message");
    testLogger.debug("Debug message");
  });
}

function testSplat() {
  console.log("\n=== String Interpolation (Splat) Test ===");

  const splatLogger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
      winston.format.splat(),
      winston.format.simple()
    ),
    transports: [new winston.transports.Console()],
  });

  splatLogger.info("User %s logged in from %s", "john_doe", "192.168.1.100");
  splatLogger.error("Failed to process %d items out of %d", 5, 100);
}

function testProfiling() {
  console.log("\n=== Profiling Test ===");

  const profiler = logger.startTimer();

  setTimeout(() => {
    profiler.done({ message: "Operation completed" });
  }, 1000);
}

async function runAllTests() {
  try {
    testBasicLogging();
    testLoggingWithMetadata();
    testCustomFormatter();
    testMultipleTransports();
    testChildLogger();
    testLogLevels();
    testSplat();
    testProfiling();

    console.log("\n=== All tests completed ===");
    console.log("Check the logs directory for output files");
  } catch (error) {
    logger.error("Test execution failed", {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

runAllTests();
