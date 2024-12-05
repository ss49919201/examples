abstract class AbstractFormatter {
  constructor(protected filePath: string) {}

  abstract format(target: string): string;
}

class DummyFomatter extends AbstractFormatter {
  constructor(filePath: string) {
    super(filePath);
  }

  format(target: string): string {
    return "dummy";
  }
}

const dummy = new DummyFomatter("dummy");
console.log(dummy instanceof AbstractFormatter);
