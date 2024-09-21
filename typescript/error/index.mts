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

  // 😊
  function returnOriginalError(): OriginalError {
    return new OriginalError2("OriginalError");
  }
}
