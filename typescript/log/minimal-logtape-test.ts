console.log('=== Minimal LogTape Test ===');

try {
  const { getLogger, configure } = await import('@logtape/logtape');

  await configure({
    sinks: {},
    loggers: []
  });

  console.log('LogTape imported and configured successfully');
} catch (error) {
  console.log('LogTape test failed:', error);
}

console.log('Test completed');