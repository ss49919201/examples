function error(message: string): never {
  throw new Error(message);
}

type T = "a" | "b" | "c";

const fn = (v: T) => {
  switch (v) {
    case "a": {
      console.log("a");
      break;
    }
    case "b": {
      console.log("b");
      break;
    }
    case "c": {
      console.log("c");
      break;
    }
    default: {
      const unreachable: never = v;
      throw new Error(`Unreachable: ${unreachable}`);
    }
  }
};
