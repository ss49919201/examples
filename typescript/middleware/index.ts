{
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
}

// use reduce
{
  type Handler<T, S> = (arg: T) => S;
  type Middleware<T, S> = (handler: Handler<T, S>) => Handler<T, S>;

  const compose = <T, S>(
    handler: Handler<T, S>,
    ...middlewares: Middleware<T, S>[]
  ): Handler<T, S> => {
    return middlewares.reduce((acc, middleware) => middleware(acc), handler);
  };

  const logger: Middleware<string, void> = (handler) => (arg) => {
    console.log({
      type: "log",
      message: `Calling handler with arg: ${arg}`,
    });
    const res = handler(arg);
    console.log({
      type: "log",
      message: "Handler returned successfully",
    });
    return res;
  };

  const error: Middleware<string, void> = (handler) => (arg) => {
    console.log({
      type: "log",
      message: "Checking for errors",
    });
    let res;
    try {
      res = handler(arg);
    } catch (e) {
      console.error(e);
    }
    console.log({
      type: "log",
      message: "No errors occurred",
    });
    return res;
  };

  const handler: Handler<string, void> = (arg) => {
    console.log(`Hello, ${arg}`);
    return "Hello, world from handler";
  };

  const composed = compose(handler, logger, error);
  console.log(composed("world"));
}
