{
  class OriginalError extends Error {
    constructor(message: string) {
      super(message);
    }
  }

  class OriginalError2 extends Error {
    constructor(message: string) {
      super(message);
    }
  }

  // 🤮
  function returnOriginalError(): OriginalError {
    return new OriginalError2("OriginalError");
  }
}

{
  class OriginalError extends Error {
    #tag = "OriginalError";

    constructor(message: string) {
      super(message);
    }
  }

  class OriginalError2 extends Error {
    #tag = "OriginalError2";

    constructor(message: string) {
      super(message);
    }
  }

  function isError<T extends Error>(
    v: unknown,
    classExtendsError: new (...args: any) => T
  ) {
    return v instanceof classExtendsError;
  }

  console.log(isError(new OriginalError("origin"), Error));
  console.log(isError(new OriginalError("origin"), OriginalError));
  console.log(isError(new OriginalError("origin"), OriginalError2));
}
