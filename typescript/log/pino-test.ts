import pino, { Logger } from 'pino';
import path from 'path';

const logDir = path.join(process.cwd(), 'logs');

const logger = pino.default({
  level: 'info',
  timestamp: pino.default.stdTimeFunctions.isoTime,
  formatters: {
    level: (label: any) => {
      return { level: label };
    }
  }
});

const fileLogger = pino.default(pino.default.destination(path.join(logDir, 'pino.log')));

function testBasicLogging() {
  console.log('=== Pino Basic Logging Test ===');
  logger.error('This is an error message');
  logger.warn('This is a warning message');
  logger.info('This is an info message');
  logger.debug('This is a debug message');
}

function testLoggingWithMetadata() {
  console.log('\n=== Pino Logging with Metadata Test ===');
  logger.info({ userId: 12345, ip: '192.168.1.1' }, 'User login');
  logger.error({ 
    database: 'users',
    error: 'Connection timeout',
    retries: 3
  }, 'Database connection failed');
}

function testChildLogger() {
  console.log('\n=== Pino Child Logger Test ===');
  
  const childLogger = logger.child({ 
    requestId: 'req-123', 
    userId: 'user-456' 
  });
  
  childLogger.info('Processing request');
  childLogger.warn('Slow query detected');
  childLogger.error('Request failed');
}

function testPrettyPrint() {
  console.log('\n=== Pino Pretty Print Test ===');
  
  try {
    const prettyLogger = pino.default({
      level: 'info'
    });
    
    prettyLogger.info({ feature: 'pretty-print' }, 'Pretty formatted message');
  } catch (error) {
    console.log('Pretty print skipped:', error instanceof Error ? error.message : String(error));
  }
}

function testFileLogging() {
  console.log('\n=== Pino File Logging Test ===');
  
  fileLogger.info({ service: 'pino-test' }, 'Message logged to file');
  fileLogger.error({ error: 'Test error' }, 'Error logged to file');
}

function testLogLevels() {
  console.log('\n=== Pino Log Levels Test ===');
  
  const levels = ['fatal', 'error', 'warn', 'info', 'debug', 'trace'];
  
  levels.forEach(level => {
    const testLogger = pino.default({ level });
    
    console.log(`\nTesting with level: ${level}`);
    testLogger.fatal('Fatal message');
    testLogger.error('Error message');
    testLogger.warn('Warning message');
    testLogger.info('Info message');
    testLogger.debug('Debug message');
    testLogger.trace('Trace message');
  });
}

function testSerialization() {
  console.log('\n=== Pino Serialization Test ===');
  
  const serializerLogger = pino.default({
    serializers: {
      req: (req: any) => ({
        method: req.method,
        url: req.url,
        headers: req.headers
      }),
      err: pino.default.stdSerializers.err
    }
  });
  
  const mockReq = {
    method: 'GET',
    url: '/api/users',
    headers: { 'user-agent': 'test-client' }
  };
  
  const mockError = new Error('Test error');
  
  serializerLogger.info({ req: mockReq }, 'Request received');
  serializerLogger.error({ err: mockError }, 'Error occurred');
}

function testMultipleDestinations() {
  console.log('\n=== Pino Multiple Destinations Test ===');
  
  const streams = [
    { stream: process.stdout },
    { stream: pino.default.destination(path.join(logDir, 'pino-multi.log')) }
  ];
  
  const multiLogger = pino.default({
    level: 'info'
  }, pino.default.multistream(streams));
  
  multiLogger.info('Message to console and file');
  multiLogger.error('Error to console and file');
}

async function runAllTests() {
  try {
    testBasicLogging();
    testLoggingWithMetadata();
    testChildLogger();
    testPrettyPrint();
    testFileLogging();
    testLogLevels();
    testSerialization();
    testMultipleDestinations();
    
    console.log('\n=== Pino tests completed ===');
    
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Test execution failed');
  }
}

runAllTests();

export { logger, runAllTests };