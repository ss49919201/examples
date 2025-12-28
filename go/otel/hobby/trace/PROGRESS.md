# TraceProvider 自作実装計画

## 目的
学習目的で OpenTelemetry の TraceProvider を最小限の機能で実装する。

## 実装方針

### アーキテクチャ概要
```
TracerProvider
  ↓ 生成
Tracer
  ↓ 生成
Span
  ↓ 処理
SpanProcessor
  ↓ エクスポート
SpanExporter
```

### 実装範囲
- **含む**: 基本的なトレース機能（Span の作成・終了・属性設定）
- **含まない**: サンプリング、バッチ処理、コンテキスト伝播の複雑な機能

## 実装ステップ（各100行以下）

### Step 1: 基本型とインターフェース定義 (~80行)
**ファイル**: `types.go`

実装内容:
- `TraceID` と `SpanID` の型定義（16バイトと8バイト）
- `SpanContext` 構造体（TraceID, SpanID, TraceFlags を保持）
- ID 生成関数（ランダム生成）
- SpanContext の基本メソッド（`IsValid()`, `TraceID()`, `SpanID()`, `IsSampled()`）

理由: OpenTelemetry の仕様では TraceID と SpanID は必須。まず基本的な識別子から実装する。

---

### Step 2: Span の実装 (~90行)
**ファイル**: `span.go`

実装内容:
- `Span` 構造体
  - 名前、開始時刻、終了時刻
  - SpanContext
  - 属性（`map[string]interface{}`）
  - ステータス（コードと説明）
  - イベントリスト
- 必須メソッド:
  - `End()`: 終了時刻を記録、プロセッサに通知
  - `SetAttributes()`: 属性を追加
  - `SetStatus()`: ステータスを設定
  - `SetName()`: 名前を変更
  - `AddEvent()`: イベントを追加
  - `RecordError()`: エラーを記録
  - `IsRecording()`: 常に true を返す（シンプル実装）
  - `SpanContext()`: SpanContext を返す

理由: Span が中核機能。属性とイベントは `map` とスライスで簡単に実装できる。

---

### Step 3: Tracer の実装 (~70行)
**ファイル**: `tracer.go`

実装内容:
- `Tracer` 構造体
  - インストルメンテーション名
  - TracerProvider への参照
- `Start()` メソッド:
  - 新しい Span を生成
  - TraceID と SpanID を生成
  - context.Context に Span を格納
  - 親 Span があれば TraceID を継承

理由: Tracer は Span を生成するファクトリー。context.Context からの親子関係の処理が主要な機能。

---

### Step 4: TracerProvider の実装 (~60行)
**ファイル**: `provider.go`

実装内容:
- `TracerProvider` 構造体
  - Tracer のキャッシュ（`map[string]*Tracer`）
  - SpanProcessor のリスト
- `Tracer()` メソッド: Tracer を取得または生成
- `NewTracerProvider()`: コンストラクタ
- `WithSpanProcessor()`: SpanProcessor を追加するオプション関数
- `Shutdown()`: リソースをクリーンアップ

理由: TracerProvider は Tracer を管理するレジストリ。キャッシュで同じ名前の Tracer を再利用。

---

### Step 5: SpanProcessor インターフェースとシンプル実装 (~80行)
**ファイル**: `processor.go`

実装内容:
- `SpanProcessor` インターフェース:
  - `OnStart(ctx context.Context, s *Span)`
  - `OnEnd(s *Span)`
  - `Shutdown(ctx context.Context) error`
- `SimpleSpanProcessor` 実装:
  - `OnEnd()` で即座に Exporter を呼び出す
  - 同期処理（バッチ処理なし）
- `NewSimpleSpanProcessor(exporter SpanExporter)`: コンストラクタ

理由: Processor は Span のライフサイクルフック。Simple 版は同期的で実装が簡単。

---

### Step 6: SpanExporter インターフェースとコンソール Exporter (~90行)
**ファイル**: `exporter.go`

実装内容:
- `SpanExporter` インターフェース:
  - `ExportSpans(ctx context.Context, spans []*Span) error`
  - `Shutdown(ctx context.Context) error`
- `ConsoleExporter` 実装:
  - JSON 形式で標準出力に Span を出力
  - フォーマット例:
    ```json
    {
      "name": "operation",
      "trace_id": "...",
      "span_id": "...",
      "start_time": "...",
      "end_time": "...",
      "attributes": {...},
      "events": [...]
    }
    ```

理由: Exporter は最終出力先。コンソール出力なら外部依存なしで動作確認できる。

---

### Step 7: Context ヘルパー関数 (~50行)
**ファイル**: `context.go`

実装内容:
- `SpanFromContext(ctx context.Context) *Span`: context から Span を取得
- `ContextWithSpan(ctx context.Context, span *Span) context.Context`: context に Span を格納
- 内部的にカスタム context key を使用

理由: Go の context.Context を使った親子関係の伝播に必須。

---

### Step 8: 統合テストとサンプル (~90行)
**ファイル**: `example_test.go`

実装内容:
- 基本的な使用例:
  ```go
  exporter := NewConsoleExporter()
  processor := NewSimpleSpanProcessor(exporter)
  provider := NewTracerProvider(WithSpanProcessor(processor))

  tracer := provider.Tracer("example")
  ctx, span := tracer.Start(context.Background(), "operation")
  span.SetAttributes("key", "value")
  span.End()
  ```
- ネストされた Span の例
- エラー処理の例
- イベント追加の例

理由: 実装が正しく動作するか検証し、使い方のドキュメントにもなる。

---

### Step 9: go.mod とドキュメント (~40行)
**ファイル**: `go.mod`, `README.md`

実装内容:
- `go.mod`: モジュール定義、依存パッケージは最小限（標準ライブラリのみ）
- `README.md`:
  - プロジェクトの目的
  - 各コンポーネントの説明
  - 使用例
  - 制限事項（本番環境では使用しない）

理由: モジュールのセットアップと、学習者向けの説明。

---

## 実装順序の理由

1. **Bottom-up アプローチ**: 下位の型（TraceID, SpanID）から上位（Provider）へ
2. **依存関係**: 各ステップは前のステップに依存（Span → Tracer → Provider）
3. **テスト可能性**: 各ステップで単体テストを書けるように独立させる
4. **学習曲線**: 複雑さを段階的に増やす（基本型 → Span → Tracer → Provider → Processor/Exporter）

## 完成後の機能

✅ Span の作成と終了
✅ 属性とイベントの追加
✅ 親子関係のあるトレース
✅ コンソールへの出力
❌ サンプリング（常に 100% 記録）
❌ バッチ処理（常に同期処理）
❌ リモート Exporter（OTLP など）
❌ メトリクスやログとの統合

## 参考資料
- [OpenTelemetry Go Trace API](https://pkg.go.dev/go.opentelemetry.io/otel/trace)
- [OpenTelemetry Go SDK](https://pkg.go.dev/go.opentelemetry.io/otel/sdk/trace)
- [OpenTelemetry Specification](https://opentelemetry.io/docs/specs/otel/)
