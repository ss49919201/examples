import fs from "fs";
import path from "path";
import { Logger } from "tslog";

const logDir = path.join(process.cwd(), "logs");

const logger = new Logger({
  name: "tslog-test",
  minLevel: 0,
  type: "pretty",
});

const fileLogger = new Logger({
  name: "tslog-file",
  minLevel: 0,
  type: "json",
});

function testBasicLogging() {
  console.log("=== TSLog Basic Logging Test ===");
  logger.silly("This is a silly message");
  logger.trace("This is a trace message");
  logger.debug("This is a debug message");
  logger.info("This is an info message");
  logger.warn("This is a warning message");
  logger.error("This is an error message");
  logger.fatal("This is a fatal message");
}

function testLoggingWithMetadata() {
  console.log("\n=== TSLog Logging with Metadata Test ===");
  logger.info("User login", { userId: 12345, ip: "192.168.1.1" });
  logger.error("Database connection failed", {
    database: "users",
    error: "Connection timeout",
    retries: 3,
  });
}

function testChildLogger() {
  console.log("\n=== TSLog Child Logger Test ===");

  const childLogger = logger.getSubLogger({
    name: "auth-module",
    prefix: ["AUTH"],
  });

  childLogger.info("Processing request");
  childLogger.warn("Slow query detected");
  childLogger.error("Request failed");
}

function testDifferentFormats() {
  console.log("\n=== TSLog Different Formats Test ===");

  const prettyLogger = new Logger({ type: "pretty" });
  const jsonLogger = new Logger({ type: "json" });
  const hiddenLogger = new Logger({ type: "hidden" });

  console.log("Pretty format:");
  prettyLogger.info("Pretty formatted message");

  console.log("\nJSON format:");
  jsonLogger.info("JSON formatted message");

  console.log("\nHidden format (no output):");
  hiddenLogger.info("Hidden message");
}

function testLogLevels() {
  console.log("\n=== TSLog Log Levels Test ===");

  const levels = [0, 1, 2, 3, 4, 5, 6]; // silly, trace, debug, info, warn, error, fatal
  const levelNames = [
    "silly",
    "trace",
    "debug",
    "info",
    "warn",
    "error",
    "fatal",
  ];

  levels.forEach((level, index) => {
    const testLogger = new Logger({ minLevel: level, type: "pretty" });

    console.log(`\nTesting with minLevel: ${levelNames[index]}`);
    testLogger.silly("Silly message");
    testLogger.trace("Trace message");
    testLogger.debug("Debug message");
    testLogger.info("Info message");
    testLogger.warn("Warning message");
    testLogger.error("Error message");
    testLogger.fatal("Fatal message");
  });
}

function testFileLogging() {
  console.log("\n=== TSLog File Logging Test ===");

  const logFilePath = path.join(logDir, "tslog.log");

  // Write log to file
  const logToFile = (logObj: any) => {
    fs.appendFileSync(logFilePath, JSON.stringify(logObj) + "\n");
  };

  fileLogger.attachTransport(logToFile);

  fileLogger.info("Message logged to file");
  fileLogger.error("Error logged to file", { errorCode: 500 });

  console.log(`Logs written to: ${logFilePath}`);
}

function testContextualLogging() {
  console.log("\n=== TSLog Contextual Logging Test ===");

  const contextLogger = new Logger({
    name: "context-test",
    type: "pretty",
  });

  // Add context that will be included in all logs
  const logWithContext = contextLogger.getSubLogger({
    prefix: ["API"],
  });

  logWithContext.info("Service started");
  logWithContext.warn("High memory usage detected");
  logWithContext.error("Service crashed");
}

function testMasking() {
  console.log("\n=== TSLog Masking Test ===");

  const maskingLogger = new Logger({
    name: "masking-test",
    type: "pretty",
    maskValuesOfKeys: ["password", "token", "secret"],
  });

  maskingLogger.info("User authentication", {
    username: "john_doe",
    password: "secret123",
    token: "abc123def456",
    secret: "top-secret-key",
  });
}

function testStackTrace() {
  console.log("\n=== TSLog Stack Trace Test ===");

  const stackLogger = new Logger({
    name: "stack-test",
    type: "pretty",
  });

  function testFunction() {
    stackLogger.error("Error with stack trace");
  }

  testFunction();
}

function testPerformanceLogging() {
  console.log("\n=== TSLog Performance Logging Test ===");

  const start = Date.now();

  for (let i = 0; i < 1000; i++) {
    logger.info(`Performance test message ${i}`);
  }

  const end = Date.now();
  logger.info(`Logged 1000 messages in ${end - start}ms`);
}

function testCustomTransport() {
  console.log("\n=== TSLog Custom Transport Test ===");

  const customLogger = new Logger({
    name: "custom-transport",
    type: "json",
  });

  // Custom transport that filters and processes logs
  const customTransport = (logObj: any) => {
    const meta = logObj._meta;
    if (meta?.logLevelId >= 4) {
      // warn level and above
      console.log(`ALERT: ${meta?.logLevelName?.toUpperCase()} - ${logObj[0]}`);
    }
  };

  customLogger.attachTransport(customTransport);

  customLogger.info("Info message (not alerted)");
  customLogger.warn("Warning message (alerted)");
  customLogger.error("Error message (alerted)");
}

async function runAllTests() {
  try {
    testBasicLogging();
    testLoggingWithMetadata();
    testChildLogger();
    testDifferentFormats();
    testLogLevels();
    testFileLogging();
    testContextualLogging();
    testMasking();
    testStackTrace();
    testPerformanceLogging();
    testCustomTransport();

    console.log("\n=== TSLog tests completed ===");
  } catch (error) {
    logger.error(
      "Test execution failed",
      error instanceof Error ? error.message : String(error)
    );
  }
}

runAllTests();

export { logger, runAllTests };
