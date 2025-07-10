# フェーズ2: 変換機能の実装

## 目標
整数、文字列、ビット表現との相互変換機能を実装し、Float32型を実用的にする。

## 前提条件
- フェーズ1の基本構造とビット操作機能が完了していること
- Float32.FromBits(), ToBits()メソッドが利用可能であること

## 実装タスク

### 1. 整数変換機能

#### 1.1 整数からFloat32への変換
```go
func NewFromInt32(value int32) Float32
func NewFromInt64(value int64) Float32
func NewFromUint32(value uint32) Float32
func NewFromUint64(value uint64) Float32
```

**実装詳細：**
- 符号の決定
- 2の補数表現から絶対値を取得
- 先頭ビットの位置を特定（指数部の計算）
- 仮数部の構築（23ビットに正規化）
- 丸めの処理

#### 1.2 Float32から整数への変換
```go
func (f Float32) ToInt32() (int32, error)
func (f Float32) ToInt64() (int64, error)
func (f Float32) ToUint32() (uint32, error)
func (f Float32) ToUint64() (uint64, error)
```

**実装詳細：**
- 指数部から整数部分の桁数を計算
- 仮数部から整数値を復元
- オーバーフローチェック
- 符号の適用

### 2. 文字列変換機能

#### 2.1 文字列からFloat32への変換
```go
func ParseFloat32(s string) (Float32, error)
```

**サポートする形式：**
- 基本形式: `"123.456"`, `"-123.456"`
- 科学記法: `"1.23e4"`, `"-1.23E-4"`
- 特殊値: `"NaN"`, `"Inf"`, `"-Inf"`
- ゼロ: `"0"`, `"-0"`

**実装詳細：**
- 文字列の解析とバリデーション
- 符号の処理
- 整数部と小数部の分離
- 指数部の処理
- 10進数から2進数への変換
- 丸めの処理

#### 2.2 Float32から文字列への変換
```go
func (f Float32) String() string
func (f Float32) Format(format string) string
```

**サポートする形式：**
- デフォルト: 最短表現
- 固定小数点: `"123.456000"`
- 科学記法: `"1.234560e+02"`
- 16進数: `"0x1.23p+4"`

### 3. 特殊値の変換処理

#### 3.1 特殊値の生成
```go
func NewNaN() Float32
func NewInf(sign int) Float32
func NewZero(sign int) Float32
```

#### 3.2 特殊値の判定
```go
func (f Float32) IsNaN() bool
func (f Float32) IsInf() bool
func (f Float32) IsZero() bool
func (f Float32) IsSubnormal() bool
```

### 4. 精度とエラーハンドリング

#### 4.1 丸めモード
```go
type RoundingMode int

const (
    RoundToNearest RoundingMode = iota
    RoundToZero
    RoundToPositiveInf
    RoundToNegativeInf
)

func (f Float32) RoundTo(mode RoundingMode) Float32
```

#### 4.2 エラー型
```go
type ConversionError struct {
    Op    string
    Value string
    Err   error
}

func (e *ConversionError) Error() string
```

## 実装順序

1. **整数からFloat32への変換** (90分)
   - int32, uint32の変換実装
   - int64, uint64の変換実装（オーバーフロー処理含む）
   - テストケースの作成

2. **Float32から整数への変換** (60分)
   - 各整数型への変換実装
   - エラーハンドリングの実装
   - 境界値テストの作成

3. **文字列解析機能** (120分)
   - 基本数値形式の解析
   - 科学記法の解析
   - 特殊値の処理
   - エラーハンドリング

4. **文字列フォーマット機能** (90分)
   - デフォルト文字列表現
   - 各種フォーマットの実装
   - 精度制御

5. **特殊値とエラー処理** (45分)
   - 特殊値の生成と判定
   - 丸めモードの実装
   - エラー型の定義

## テスト計画

### 単体テスト
- [ ] 整数変換の正確性テスト
  - 正の数、負の数、ゼロ
  - 境界値（最大値、最小値）
  - オーバーフロー条件
- [ ] 文字列変換の正確性テスト
  - 各種数値形式
  - 特殊値
  - 不正な入力
- [ ] 丸めの正確性テスト

### 統合テスト
- [ ] 標準float32との比較テスト
- [ ] 変換の可逆性テスト（A → B → A）
- [ ] パフォーマンステスト

### エラーケーステスト
- [ ] オーバーフロー/アンダーフロー
- [ ] 不正な文字列形式
- [ ] NaN/Infinityの処理

## 成果物

1. **変換機能付きFloat32型**
   - 完全な整数変換機能
   - 包括的な文字列変換機能
   - 特殊値の適切な処理

2. **テストファイル**
   - `phase2_test.go`
   - ベンチマークテスト

3. **使用例**
   - 各変換機能の使用例
   - エラーハンドリングの例

## 使用例

```go
// 整数からの変換
f1 := NewFromInt32(42)
f2 := NewFromInt64(-1234567890)

// 文字列からの変換
f3, err := ParseFloat32("123.456")
if err != nil {
    log.Fatal(err)
}

// 文字列への変換
s := f3.String()  // "123.456"

// 整数への変換
i, err := f1.ToInt32()  // 42
if err != nil {
    log.Fatal(err)
}

// 特殊値
nan := NewNaN()
inf := NewInf(1)  // +Inf
fmt.Println(nan.String())  // "NaN"
fmt.Println(inf.String())  // "+Inf"
```

## 次フェーズへの準備

このフェーズ完了後、以下が利用可能になります：
- 実用的な数値型としての基本機能
- 他の数値型との相互変換
- 文字列表現での入出力
- 適切なエラーハンドリング

これらの機能により、フェーズ3以降の演算機能を実装し、実際の計算に使用できるようになります。