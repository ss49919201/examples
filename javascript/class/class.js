// https://jsprimer.net/basic/class/
{
  class UserProfile {
    #name;

    constructor(name) {
      this.name = name;
    }

    get name() {
      return this.#name;
    }

    set name(value) {
      if (!value) {
        throw new Error("Name is required");
      }
      this.#name = value;
    }
  }

  try {
    const profile = new UserProfile("value");
    console.log(profile.name);
  } catch (e) {
    console.error(e.message); // "Name is required"
  }
}

{
  class User {
    // プロトタイプメソッド
    // prototype プロパティのオブジェクトに定義される。
    // prototype プロパティは関数オブジェクトに自動的に作成される。Class は関数オブジェクトの一種。
    method() {
      console.log("プロトタイプ");
    }

    // インスタンスオブジェクトメソッド
    method = function () {
      console.log("インスタンス");
    };
  }

  const user = new User();
  user.method(); // インスタンス
  delete user.method;
  user.method(); // プロトタイプ

  console.log(User.prototype.method); // [Function: method]
  console.log(User.prototype.constructor); // [class User]
  console.log(User.prototype.constructor === User); // true
}

{
  class User {
    // プロトタイプメソッド
    // prototype プロパティのオブジェクトに定義される。
    // prototype プロパティは関数オブジェクトに自動的に作成される。Class は関数オブジェクトの一種。
    method() {
      console.log("プロトタイプ");
    }

    // インスタンスオブジェクトメソッド
    method = function () {
      console.log("インスタンス");
    };
  }

  // new 演算子でインスタンス作成時に [[prototype]] というオブジェクトに、Class のプロトタイプへの参照が代入される。
  // プロパティアクセスする場合は __proto__ にドット演算子でアクセスする。
  const user = new User();
  console.log(Object.getPrototypeOf(user) === User.prototype); // true
  console.log(user.__proto__.method); // [Function: method]

  // インスタンスオブジェクトにプロパティが存在しなかった場合、[[prototype]] のプロパティを探索する。
  user.__proto__.prop = "prop";
  console.log(Object.hasOwn(user, "prop"));
  console.log(user.prop);
}

{
  class Parent {
    name;
    constructor(name) {
      this.name = name;
    }
  }

  class Child extends Parent {
    constructor(name) {
      super(name); // 親クラスの constructor を呼び出す。super を呼び出すだけの constructor であれば、省略しても結果は同じ。
    }
  }

  console.log(new Child("name").name);
}

{
  class Parent {
    #name;
    #parentName;

    constructor() {
      this.name = "Parent";
      this.#name = "Parent";
    }

    parent() {
      console.log(this.#name);
    }
  }
  class Child extends Parent {
    #name;
    constructor() {
      // 子クラスでは`super()`を`this`に触る前に呼び出さなければならない
      super();
      // 子クラスのコンストラクタ処理
      // 親クラスで書き込まれた`name`は上書きされる
      this.name = "Child";
      this.#name = "Child";
    }
    child() {
      console.log(this.#name);
    }
    parentName() {
      // console.log(this.#parentName); // 親クラスのプライベートプロパティは参照できない
    }
  }
  const parent = new Parent();
  const child = new Child();

  parent.parent(); // => "Parent"
  child.parent(); // => "Parent"
  child.child(); // => "Child"
  child.child(); // => "Child"
  console.log(Child.__proto__.__proto__ === Parent.__proto__); // true
}

{
  class Parent {
    static foo() {
      return "foo";
    }

    static bar = "bar";
  }

  class Child extends Parent {}

  // 静的プロパティも継承される
  console.log(Child.foo());
  console.log(Child.bar);
}
