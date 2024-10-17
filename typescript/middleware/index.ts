const applyHandlers = async (
  fn: () => Promise<void>,
  handlers: ((fn: () => Promise<void>) => Promise<void>)[]
) => {
  if (handlers.length === 0) {
    await fn(); // ミドルウェアがない場合はそのまま実行
    return;
  }

  const [firstHandler, ...restHandlers] = handlers;

  // 最初のミドルウェアに、次のミドルウェアを再帰的に渡して実行
  await firstHandler(() => applyHandlers(fn, restHandlers));
};

const errorHandler = async (fn: () => Promise<void>) => {
  console.log("check error...");
  try {
    await fn();
  } catch (error) {
    console.error(error);
    throw error;
  }
  console.log("no error");
};

const logHandler = async (fn: () => Promise<void>) => {
  try {
    console.log("start");
    await fn();
  } finally {
    console.log("end");
  }
};

const hanlder = async () => {
  // execute...
  console.log("execute");
  throw new Error("error");
};

applyHandlers(hanlder, [errorHandler, logHandler]);
