import { getLogger, configure } from '@logtape/logtape';

console.log('=== Simple LogTape Test ===');

try {
  configure({
    sinks: {
      console: console
    },
    loggers: [
      {
        category: 'test',
        level: 'debug',
        sinks: ['console']
      }
    ]
  });

  const logger = getLogger('test');

  logger.info('LogTape is working!');
  logger.warn('This is a warning');
  logger.error('This is an error');

  console.log('=== LogTape test completed ===');
} catch (error) {
  console.log('LogTape test failed:', error);
}