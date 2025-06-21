import bunyan, { LogLevel } from 'bunyan';
import path from 'path';

const logDir = path.join(process.cwd(), 'logs');

const logger = bunyan.createLogger({
  name: 'bunyan-test',
  level: 'info',
  streams: [
    {
      level: 'info',
      stream: process.stdout
    },
    {
      level: 'info',
      path: path.join(logDir, 'bunyan.log')
    },
    {
      level: 'error',
      path: path.join(logDir, 'bunyan-error.log')
    }
  ]
});

function testBasicLogging() {
  console.log('=== Bunyan Basic Logging Test ===');
  logger.fatal('This is a fatal message');
  logger.error('This is an error message');
  logger.warn('This is a warning message');
  logger.info('This is an info message');
  logger.debug('This is a debug message');
  logger.trace('This is a trace message');
}

function testLoggingWithMetadata() {
  console.log('\n=== Bunyan Logging with Metadata Test ===');
  logger.info({ userId: 12345, ip: '192.168.1.1' }, 'User login');
  logger.error({ 
    database: 'users',
    error: 'Connection timeout',
    retries: 3
  }, 'Database connection failed');
}

function testChildLogger() {
  console.log('\n=== Bunyan Child Logger Test ===');
  
  const childLogger = logger.child({ 
    requestId: 'req-123', 
    userId: 'user-456',
    component: 'auth'
  });
  
  childLogger.info('Processing request');
  childLogger.warn('Slow query detected');
  childLogger.error('Request failed');
}

function testMultipleStreams() {
  console.log('\n=== Bunyan Multiple Streams Test ===');
  
  const multiLogger = bunyan.createLogger({
    name: 'multi-stream',
    streams: [
      {
        level: 'debug',
        stream: process.stdout
      },
      {
        level: 'info',
        path: path.join(logDir, 'bunyan-multi.log')
      },
      {
        level: 'error',
        path: path.join(logDir, 'bunyan-multi-error.log')
      }
    ]
  });
  
  multiLogger.debug('Debug message to console only');
  multiLogger.info('Info message to console and file');
  multiLogger.error('Error message to all streams');
}

function testLogLevels() {
  console.log('\n=== Bunyan Log Levels Test ===');
  
  const levels = [
    bunyan.TRACE,
    bunyan.DEBUG, 
    bunyan.INFO,
    bunyan.WARN,
    bunyan.ERROR,
    bunyan.FATAL
  ];
  
  const levelNames = ['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'];
  
  levels.forEach((level, index) => {
    const testLogger = bunyan.createLogger({
      name: 'level-test',
      level: level,
      stream: process.stdout
    });
    
    console.log(`\nTesting with level: ${levelNames[index]}`);
    testLogger.fatal('Fatal message');
    testLogger.error('Error message');
    testLogger.warn('Warning message');
    testLogger.info('Info message');
    testLogger.debug('Debug message');
    testLogger.trace('Trace message');
  });
}

function testSerialization() {
  console.log('\n=== Bunyan Serialization Test ===');
  
  const serializerLogger = bunyan.createLogger({
    name: 'serializer-test',
    streams: [{ stream: process.stdout }],
    serializers: {
      req: bunyan.stdSerializers.req,
      res: bunyan.stdSerializers.res,
      err: bunyan.stdSerializers.err
    }
  });
  
  // Mock request object
  const mockReq = {
    method: 'GET',
    url: '/api/users',
    headers: { 'user-agent': 'test-client' },
    httpVersion: '1.1',
    connection: { remoteAddress: '127.0.0.1' }
  };
  
  const mockError = new Error('Test error');
  
  serializerLogger.info({ req: mockReq }, 'Request received');
  serializerLogger.error({ err: mockError }, 'Error occurred');
}

function testRotatingFileStream() {
  console.log('\n=== Bunyan Rotating File Stream Test ===');
  
  const rotatingLogger = bunyan.createLogger({
    name: 'rotating-test',
    streams: [{
      type: 'rotating-file',
      path: path.join(logDir, 'bunyan-rotating.log'),
      period: '1d',   // daily rotation
      count: 3        // keep 3 back copies
    }]
  });
  
  for (let i = 0; i < 10; i++) {
    rotatingLogger.info(`Rotating log message ${i}`);
  }
}

function testCustomFields() {
  console.log('\n=== Bunyan Custom Fields Test ===');
  
  const customLogger = bunyan.createLogger({
    name: 'custom-fields',
    stream: process.stdout,
    // Add custom fields to all log records
    environment: 'test',
    version: '1.0.0'
  });
  
  customLogger.info('Message with custom fields');
  customLogger.error({ customField: 'customValue' }, 'Error with additional custom field');
}

function testPerformanceLogging() {
  console.log('\n=== Bunyan Performance Logging Test ===');
  
  const start = Date.now();
  
  for (let i = 0; i < 1000; i++) {
    logger.info(`Performance test message ${i}`);
  }
  
  const end = Date.now();
  logger.info(`Logged 1000 messages in ${end - start}ms`);
}

function testLogFormatting() {
  console.log('\n=== Bunyan Log Formatting Test ===');
  
  // Bunyan logs are in JSON format by default
  logger.info('Simple message');
  logger.info({ key: 'value', number: 42, boolean: true }, 'Message with structured data');
  
  // For pretty printing, you would typically use bunyan CLI tool
  // bunyan logs/bunyan.log
}

async function runAllTests() {
  try {
    testBasicLogging();
    testLoggingWithMetadata();
    testChildLogger();
    testMultipleStreams();
    testLogLevels();
    testSerialization();
    testRotatingFileStream();
    testCustomFields();
    testPerformanceLogging();
    testLogFormatting();
    
    console.log('\n=== Bunyan tests completed ===');
    
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Test execution failed');
  }
}

runAllTests();

export { logger, runAllTests };