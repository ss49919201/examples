import { Effect } from "effect";

console.log("\n=== エラーハンドリングの学習 ===");

// カスタムエラー型の定義
class NetworkError {
  readonly _tag = "NetworkError";
  constructor(public message: string) {}
}

class ValidationError {
  readonly _tag = "ValidationError";
  constructor(public field: string, public message: string) {}
}

// 1. 基本的なエラーハンドリング
const riskyOperation = Effect.gen(function* () {
  const randomValue = Math.random();
  if (randomValue > 0.5) {
    return `成功: ${randomValue}`;
  } else {
    yield* Effect.fail(new NetworkError("ネットワーク接続に失敗しました"));
  }
});

// 2. catchAll - すべてのエラーをキャッチ
const handleAllErrors = Effect.catchAll(riskyOperation, error => {
  console.log("エラーをキャッチ:", error);
  return Effect.succeed("デフォルト値");
});

console.log("\n1. すべてのエラーをキャッチ:");
Effect.runPromise(handleAllErrors).then(result => 
  console.log("結果:", result)
);

// 3. catchTag - 特定のエラータグをキャッチ
const specificErrorHandling = Effect.catchTag(riskyOperation, "NetworkError", error => {
  console.log("ネットワークエラーを処理:", error.message);
  return Effect.succeed("ネットワークエラーから復旧");
});

console.log("\n2. 特定のエラータグをキャッチ:");
Effect.runPromise(specificErrorHandling).then(result => 
  console.log("結果:", result)
);

// 4. retry - リトライ機能
const retryableOperation = Effect.gen(function* () {
  const randomValue = Math.random();
  console.log(`試行中... (${randomValue})`);
  if (randomValue > 0.8) {
    return "成功！";
  } else {
    yield* Effect.fail(new NetworkError("一時的なエラー"));
  }
});

const withRetry = Effect.retry(retryableOperation, {
  times: 3,
  delay: "100 millis"
});

console.log("\n3. リトライ機能:");
Effect.runPromise(withRetry)
  .then(result => console.log("リトライ結果:", result))
  .catch(error => console.log("リトライ失敗:", error));

// 5. 複数のエラー型を扱う
const multipleErrorTypes = Effect.gen(function* () {
  const input = "invalid-email";
  
  if (!input.includes("@")) {
    yield* Effect.fail(new ValidationError("email", "無効なメールアドレス"));
  }
  
  if (Math.random() > 0.7) {
    yield* Effect.fail(new NetworkError("APIサーバーに接続できません"));
  }
  
  return `有効なメール: ${input}`;
});

const handleMultipleErrors = Effect.catchTags(multipleErrorTypes, {
  ValidationError: error => {
    console.log(`バリデーションエラー [${error.field}]: ${error.message}`);
    return Effect.succeed("バリデーションエラーから復旧");
  },
  NetworkError: error => {
    console.log(`ネットワークエラー: ${error.message}`);
    return Effect.succeed("ネットワークエラーから復旧");
  }
});

console.log("\n4. 複数のエラー型を処理:");
Effect.runPromise(handleMultipleErrors).then(result => 
  console.log("結果:", result)
);

// 6. エラーの変換
const transformError = Effect.mapError(riskyOperation, error => {
  if (error instanceof NetworkError) {
    return new Error(`変換されたエラー: ${error.message}`);
  }
  return error;
});

console.log("\n5. エラーの変換:");
Effect.runPromise(transformError).catch(error => 
  console.log("変換されたエラー:", error.message)
);

// 7. Either型を使った結果
const toEither = Effect.either(riskyOperation);

console.log("\n6. Either型での結果:");
Effect.runPromise(toEither).then(result => {
  if (result._tag === "Left") {
    console.log("エラー結果:", result.left);
  } else {
    console.log("成功結果:", result.right);
  }
});

// 8. オプション型を使った結果
const toOption = Effect.option(riskyOperation);

console.log("\n7. Option型での結果:");
Effect.runPromise(toOption).then(result => {
  if (result._tag === "None") {
    console.log("エラーが発生しました（詳細は非表示）");
  } else {
    console.log("成功結果:", result.value);
  }
});

export { NetworkError, ValidationError, riskyOperation };