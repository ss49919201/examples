import { expect, it } from "vitest";

const validateAge = (age: number) => {
  if (!Number.isInteger(age)) {
    throw new Error("number must be integer");
  }

  const between0and150 = age >= 0 && age <= 150;
  if (!between0and150) {
    throw new Error("number must be `0 <= age <= 150`");
  }
};

// in-source test suites
if (import.meta.vitest) {
  it("有効同値パーティション(整数、0以上150以下、代表値=75)", () => {
    expect(() => validateAge(75)).not.toThrow();
  });

  it("無効同値パーティション(0未満150超、代表値=151)", () => {
    expect(() => validateAge(151)).toThrow();
  });

  it("無効同値パーティション(少数、代表値=1.1)", () => {
    expect(() => validateAge(1.1)).toThrow();
  });
}

const validateName = (name: string) => {
  if (!/^[a-zA-Z]$/.test(name))
    throw new Error("名前は1文字以上の半角英字で入力してください");
};

if (import.meta.vitest) {
  it("有効同値パーティション(1文字、半角英字)", () => {
    expect(() => validateName("a")).not.toThrow();
  });
  it("無効同値パーティション(0文字)", () => {
    expect(() => validateName("")).toThrow();
  });
  it("無効同値パーティション(全角)", () => {
    expect(() => validateName("ア")).toThrow();
  });
}
