import { Logger } from 'tslog';

console.log('=== Simple TSLog Test ===');

const logger = new Logger({ name: 'simple-test' });

logger.info('TSLog is working!');
logger.warn('This is a warning');
logger.error('This is an error');

console.log('=== TSLog test completed ===');