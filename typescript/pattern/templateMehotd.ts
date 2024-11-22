abstract class TemplateMethod {
  public run(): void {
    if (this.operation1()) {
      this.operation2();
    }
  }

  protected abstract operation1(): boolean;
  protected abstract operation2(): void;
}

class ConcreteClass1 extends TemplateMethod {
  static create(): TemplateMethod {
    return new ConcreteClass1();
  }

  private constructor() {
    super();
  }

  operation1(): boolean {
    return true;
  }

  operation2(): void {
    console.log("ConcreteClass1.operation2");
  }
}

class ConcreteClass2 extends TemplateMethod {
  static create(): TemplateMethod {
    return new ConcreteClass2();
  }

  private constructor() {
    super();
  }

  operation1(): boolean {
    return false;
  }

  operation2(): void {
    console.log("ConcreteClass2.operation2");
  }
}

let templateMethod: TemplateMethod = ConcreteClass1.create();
templateMethod.run();

templateMethod = ConcreteClass2.create();
templateMethod.run();
