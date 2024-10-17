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
  type Middleware<T, S> = (next: Handler<T, S>) => Handler<T, S>;

  function compose<T, S>(
    handler: Handler<T, S>,
    ...middlewares: Middleware<T, S>[]
  ): Handler<T, S> {
    return middlewares.reduce((acc, middleware) => middleware(acc), handler);
  }

  function logger<T, S>(next: Handler<T, S>): Handler<T, S> {
    return (arg) => {
      console.log({
        type: "log",
        message: `Calling handler with arg: ${arg}`,
      });
      const res = next(arg);
      console.log({
        type: "log",
        message: "Handler returned successfully",
      });
      return res;
    };
  }

  function error<T, S>(next: Handler<T, S>): Handler<T, S> {
    return (arg) => {
      console.log({
        type: "log",
        message: "Checking for errors",
      });
      let res;
      try {
        res = next(arg);
      } catch (e) {
        console.error(e);
        throw e;
      }
      console.log({
        type: "log",
        message: "No errors occurred",
      });
      return res;
    };
  }

  function handler(arg: string): string {
    console.log(`Hello, ${arg}!`);
    throw new Error("Error");
    // return `Hello, ${arg}!`;
  }

  const composed = compose(handler, logger, error);
  console.log(composed("world"));
}
