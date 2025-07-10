import { Effect } from "effect";

console.log("=== Effect.ts基本概念の学習 ===");

// 1. Effect型の基本
// Effect<Success, Error, Requirements>
// - Success: 成功時の値の型
// - Error: エラーの型
// - Requirements: 必要な依存関係の型

// 2. Effectの作成方法

// 成功値を返すEffect
const successEffect = Effect.succeed(42);
console.log("\n1. 成功値を返すEffect:");
Effect.runPromise(successEffect).then(result => 
  console.log("結果:", result)
);

// 失敗を返すEffect
const failureEffect = Effect.fail("エラーが発生しました");
console.log("\n2. 失敗を返すEffect:");
Effect.runPromise(failureEffect).catch(error => 
  console.log("エラー:", error)
);

// 同期的な計算をEffectに変換
const syncEffect = Effect.sync(() => {
  console.log("同期的な計算を実行中...");
  return Math.random();
});
console.log("\n3. 同期的な計算:");
Effect.runPromise(syncEffect).then(result => 
  console.log("ランダムな値:", result)
);

// 非同期の計算をEffectに変換
const asyncEffect = Effect.promise(() => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve("非同期処理完了");
    }, 1000);
  });
});
console.log("\n4. 非同期の計算:");
Effect.runPromise(asyncEffect).then(result => 
  console.log("非同期結果:", result)
);

// Effectの合成（map）
const mappedEffect = Effect.map(successEffect, value => value * 2);
console.log("\n5. Effectの変換（map）:");
Effect.runPromise(mappedEffect).then(result => 
  console.log("2倍した値:", result)
);

// Effectの合成（flatMap）
const flatMappedEffect = Effect.flatMap(successEffect, value => 
  Effect.succeed(value.toString())
);
console.log("\n6. Effectの平坦化（flatMap）:");
Effect.runPromise(flatMappedEffect).then(result => 
  console.log("文字列に変換:", result)
);

// 複数のEffectを組み合わせる
const combinedEffect = Effect.all([
  Effect.succeed(1),
  Effect.succeed(2),
  Effect.succeed(3)
]);
console.log("\n7. 複数のEffectを組み合わせ:");
Effect.runPromise(combinedEffect).then(result => 
  console.log("配列の結果:", result)
);

// ジェネレーター構文を使った書き方
const generatorEffect = Effect.gen(function* () {
  const a = yield* Effect.succeed(10);
  const b = yield* Effect.succeed(20);
  return a + b;
});
console.log("\n8. ジェネレーター構文:");
Effect.runPromise(generatorEffect).then(result => 
  console.log("合計:", result)
);

export { successEffect, failureEffect, syncEffect, asyncEffect };