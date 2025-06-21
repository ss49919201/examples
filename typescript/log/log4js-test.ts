import log4js from 'log4js';
import path from 'path';

const logDir = path.join(process.cwd(), 'logs');

log4js.configure({
  appenders: {
    console: { type: 'console' },
    file: { type: 'file', filename: path.join(logDir, 'log4js.log') },
    dateFile: { 
      type: 'dateFile', 
      filename: path.join(logDir, 'log4js-date.log'),
      pattern: 'yyyy-MM-dd',
      compress: true
    },
    everything: { type: 'logLevelFilter', appender: 'file', level: 'debug' }
  },
  categories: {
    default: { appenders: ['console', 'file'], level: 'info' },
    app: { appenders: ['console', 'everything'], level: 'debug' }
  }
});

const logger = log4js.getLogger();
const appLogger = log4js.getLogger('app');

function testBasicLogging() {
  console.log('=== Log4js Basic Logging Test ===');
  logger.fatal('This is a fatal message');
  logger.error('This is an error message');
  logger.warn('This is a warning message');
  logger.info('This is an info message');
  logger.debug('This is a debug message');
  logger.trace('This is a trace message');
}

function testLoggingWithMetadata() {
  console.log('\n=== Log4js Logging with Metadata Test ===');
  logger.info('User login', { userId: 12345, ip: '192.168.1.1' });
  logger.error('Database connection failed', { 
    database: 'users',
    error: 'Connection timeout',
    retries: 3
  });
}

function testCategoryLogging() {
  console.log('\n=== Log4js Category Logging Test ===');
  
  appLogger.debug('Debug message from app logger');
  appLogger.info('Info message from app logger');
  appLogger.error('Error message from app logger');
}

function testMultipleAppenders() {
  console.log('\n=== Log4js Multiple Appenders Test ===');
  
  log4js.configure({
    appenders: {
      console: { type: 'console' },
      file: { type: 'file', filename: path.join(logDir, 'multi.log') },
      error: { type: 'file', filename: path.join(logDir, 'errors.log') }
    },
    categories: {
      default: { appenders: ['console', 'file'], level: 'info' },
      error: { appenders: ['console', 'error'], level: 'error' }
    }
  });
  
  const multiLogger = log4js.getLogger();
  const errorLogger = log4js.getLogger('error');
  
  multiLogger.info('Info message to console and file');
  errorLogger.error('Error message to console and error file');
}

function testCustomLayout() {
  console.log('\n=== Log4js Custom Layout Test ===');
  
  log4js.configure({
    appenders: {
      custom: {
        type: 'console',
        layout: {
          type: 'pattern',
          pattern: '%d{ISO8601} [%p] %c - %m'
        }
      }
    },
    categories: {
      default: { appenders: ['custom'], level: 'info' }
    }
  });
  
  const customLogger = log4js.getLogger();
  customLogger.info('Custom formatted message');
  customLogger.error('Custom error message');
}

function testLogLevels() {
  console.log('\n=== Log4js Log Levels Test ===');
  
  const levels = ['ALL', 'TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL', 'OFF'];
  
  levels.forEach(level => {
    log4js.configure({
      appenders: { console: { type: 'console' } },
      categories: { default: { appenders: ['console'], level: level } }
    });
    
    const testLogger = log4js.getLogger();
    
    console.log(`\nTesting with level: ${level}`);
    testLogger.fatal('Fatal message');
    testLogger.error('Error message');
    testLogger.warn('Warning message');
    testLogger.info('Info message');
    testLogger.debug('Debug message');
    testLogger.trace('Trace message');
  });
}

function testClusteringSupport() {
  console.log('\n=== Log4js Clustering Support Test ===');
  
  log4js.configure({
    appenders: {
      clustered: {
        type: 'multiprocess',
        mode: 'master',
        loggerPort: 5000,
        appender: 'file'
      },
      file: { type: 'file', filename: path.join(logDir, 'cluster.log') },
      console: { type: 'console' }
    },
    categories: {
      default: { appenders: ['console'], level: 'info' }
    }
  });
  
  const clusterLogger = log4js.getLogger();
  clusterLogger.info('Cluster logging test message');
}

function testPerformanceLogging() {
  console.log('\n=== Log4js Performance Logging Test ===');
  
  const start = Date.now();
  
  for (let i = 0; i < 1000; i++) {
    logger.info(`Performance test message ${i}`);
  }
  
  const end = Date.now();
  logger.info(`Logged 1000 messages in ${end - start}ms`);
}

async function runAllTests() {
  try {
    testBasicLogging();
    testLoggingWithMetadata();
    testCategoryLogging();
    testMultipleAppenders();
    testCustomLayout();
    testLogLevels();
    testClusteringSupport();
    testPerformanceLogging();
    
    console.log('\n=== Log4js tests completed ===');
    
    // Shutdown log4js to ensure all logs are written
    log4js.shutdown();
    
  } catch (error) {
    logger.error('Test execution failed', error instanceof Error ? error.message : String(error));
  }
}

runAllTests();

export { logger, runAllTests };