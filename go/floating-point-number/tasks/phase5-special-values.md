# フェーズ5: 特殊値の処理

## 目標
IEEE 754標準に定義されている特殊値（NaN、無限大、非正規化数）の完全な処理を実装し、浮動小数点数型を完成させる。

## 前提条件
- フェーズ1-4の全機能が完了していること
- 基本演算と比較演算が正しく動作していること
- ビット操作機能が完全に実装されていること

## 実装タスク

### 1. NaN (Not a Number) の完全実装

#### 1.1 NaN の種類と判定
```go
// NaN の種類
const (
    QuietNaN     = 0x7FC00000  // クワイエットNaN
    SignalingNaN = 0x7F800001  // シグナリングNaN
)

func (f Float32) IsNaN() bool
func (f Float32) IsQuietNaN() bool
func (f Float32) IsSignalingNaN() bool
```

#### 1.2 NaN の生成
```go
func NewQuietNaN() Float32
func NewSignalingNaN() Float32
func NewNaNWithPayload(payload uint32) Float32
func (f Float32) GetNaNPayload() uint32
```

#### 1.3 NaN の伝播規則
```go
func propagateNaN(a, b Float32) Float32
func quietNaN(signalingNaN Float32) Float32
```

**実装詳細：**
- シグナリングNaN → クワイエットNaN への変換
- 演算結果でのNaN伝播
- ペイロードの保持

### 2. 無限大 (Infinity) の完全実装

#### 2.1 無限大の判定と生成
```go
func (f Float32) IsInf() bool
func (f Float32) IsPositiveInf() bool
func (f Float32) IsNegativeInf() bool

func NewPositiveInf() Float32
func NewNegativeInf() Float32
func NewInf(sign int) Float32
```

#### 2.2 無限大の演算規則
```go
func (f Float32) infAddition(other Float32) Float32
func (f Float32) infSubtraction(other Float32) Float32
func (f Float32) infMultiplication(other Float32) Float32
func (f Float32) infDivision(other Float32) Float32
```

**演算規則：**
- Inf + Inf = Inf (同符号), NaN (異符号)
- Inf - Inf = NaN
- Inf × 0 = NaN
- Inf × 有限数 = Inf
- Inf ÷ Inf = NaN
- 有限数 ÷ Inf = 0

### 3. 非正規化数 (Subnormal Numbers) の処理

#### 3.1 非正規化数の判定
```go
func (f Float32) IsSubnormal() bool
func (f Float32) IsNormal() bool
func (f Float32) GetSubnormalValue() Float32
```

#### 3.2 非正規化数の正規化
```go
func (f Float32) NormalizeSubnormal() Float32
func (f Float32) ToSubnormal() Float32
```

#### 3.3 非正規化数の演算
```go
func (f Float32) subnormalAddition(other Float32) Float32
func (f Float32) subnormalMultiplication(other Float32) Float32
```

**実装詳細：**
- 指数部が0の場合の特別処理
- 仮数部の先頭1の暗黙化なし
- 段階的アンダーフロー (Gradual Underflow)

### 4. ゼロの符号処理

#### 4.1 符号付きゼロの判定
```go
func (f Float32) IsZero() bool
func (f Float32) IsPositiveZero() bool
func (f Float32) IsNegativeZero() bool
```

#### 4.2 符号付きゼロの演算
```go
func (f Float32) zeroAddition(other Float32) Float32
func (f Float32) zeroSubtraction(other Float32) Float32
func (f Float32) zeroMultiplication(other Float32) Float32
func (f Float32) zeroDivision(other Float32) Float32
```

**符号規則：**
- +0 + +0 = +0
- +0 + -0 = +0
- -0 + -0 = -0
- +0 - +0 = +0
- +0 - -0 = +0
- -0 - +0 = -0
- -0 - -0 = +0

### 5. 例外処理とフラグ

#### 5.1 浮動小数点例外
```go
type FPException int

const (
    InvalidOperation FPException = 1 << iota
    DivisionByZero
    Overflow
    Underflow
    Inexact
)

type FPStatus struct {
    Exceptions FPException
    Flags      FPException
}
```

#### 5.2 例外ハンドリング
```go
func (f Float32) CheckInvalidOperation() bool
func (f Float32) CheckDivisionByZero() bool
func (f Float32) CheckOverflow() bool
func (f Float32) CheckUnderflow() bool

func SetExceptionHandler(handler func(FPException))
func GetFPStatus() FPStatus
func ClearFPStatus()
```

### 6. 数学関数の特殊値処理

#### 6.1 基本数学関数
```go
func (f Float32) Abs() Float32
func (f Float32) Negate() Float32
func (f Float32) Sign() int
func (f Float32) CopySign(other Float32) Float32
```

#### 6.2 分類関数
```go
func (f Float32) Classify() FPClass
func (f Float32) IsFinite() bool
func (f Float32) IsInteger() bool

type FPClass int
const (
    NaN FPClass = iota
    Infinite
    Zero
    Subnormal
    Normal
)
```

### 7. 文字列表現での特殊値

#### 7.1 特殊値の文字列化
```go
func (f Float32) String() string
func (f Float32) formatSpecialValue() string
```

**表現形式：**
- NaN → "NaN"
- +Inf → "+Inf" または "Inf"
- -Inf → "-Inf"
- +0 → "0"
- -0 → "-0" (必要に応じて)

#### 7.2 特殊値の解析
```go
func parseSpecialValue(s string) (Float32, bool)
func isSpecialValueString(s string) bool
```

## 実装順序

1. **NaN の完全実装** (120分)
   - クワイエット/シグナリングNaN の区別
   - NaN の生成と判定
   - ペイロード処理
   - 伝播規則の実装

2. **無限大の完全実装** (90分)
   - 正負無限大の処理
   - 演算規則の実装
   - 特殊ケースの処理

3. **非正規化数の処理** (150分)
   - 非正規化数の判定と生成
   - 段階的アンダーフロー
   - 演算での非正規化数処理

4. **ゼロの符号処理** (75分)
   - 符号付きゼロの実装
   - 演算での符号規則
   - 比較での符号処理

5. **例外処理システム** (105分)
   - 例外フラグの実装
   - 例外ハンドリング
   - 状態管理

6. **数学関数と文字列処理** (90分)
   - 基本数学関数の実装
   - 分類関数の実装
   - 文字列表現の完成

## テスト計画

### 特殊値テスト
- [ ] NaN の各種操作テスト
  - 生成、判定、伝播
  - ペイロード処理
  - 比較演算での振る舞い
- [ ] 無限大の操作テスト
  - 各演算での結果
  - 符号処理
  - 比較演算
- [ ] 非正規化数テスト
  - 段階的アンダーフロー
  - 演算結果の正確性
  - 正規化処理

### 例外処理テスト
- [ ] 各例外の発生条件
- [ ] 例外フラグの正確性
- [ ] 例外ハンドリングの動作

### 統合テスト
- [ ] 標準float32との比較
- [ ] 複雑な演算での特殊値処理
- [ ] パフォーマンステスト

## 成果物

1. **完全な特殊値処理機能**
   - IEEE 754準拠の全特殊値処理
   - 適切な例外処理
   - 完全な数学関数セット

2. **テストファイル**
   - `phase5_test.go`
   - 特殊値専用テスト
   - 統合テストスイート

3. **最終ドキュメント**
   - 完全なAPIリファレンス
   - 使用例集
   - パフォーマンス特性

## 使用例

```go
// NaN の処理
nan := NewQuietNaN()
fmt.Println(nan.IsNaN())           // true
fmt.Println(nan.Equal(nan))        // false (IEEE 754標準)

// 無限大の処理
inf := NewPositiveInf()
ninf := NewNegativeInf()
fmt.Println(inf.Add(ninf))         // NaN

// 非正規化数の処理
tiny := NewFromBits(0x00000001)    // 最小の非正規化数
fmt.Println(tiny.IsSubnormal())    // true

// ゼロの符号
pzero := NewZero(0)                // +0
nzero := NewZero(1)                // -0
fmt.Println(pzero.Equal(nzero))    // true
fmt.Println(pzero.IsPositiveZero()) // true
fmt.Println(nzero.IsNegativeZero()) // true

// 例外処理
SetExceptionHandler(func(exc FPException) {
    if exc&InvalidOperation != 0 {
        fmt.Println("Invalid operation detected")
    }
})

// 数学関数
a := NewFromInt32(-42)
fmt.Println(a.Abs())               // 42
fmt.Println(a.Sign())              // -1
fmt.Println(a.Classify())          // Normal

// 文字列処理
inf_str := inf.String()            // "Inf"
nan_str := nan.String()            // "NaN"
```

## 最終統合とテスト

### 統合テストスイート
1. **全機能の統合テスト**
2. **標準float32との詳細比較**
3. **大規模データでの動作確認**
4. **パフォーマンス最適化**

### 最終成果物
- 完全にIEEE 754準拠の単精度浮動小数点数型
- 包括的なテストスイート
- 完全なドキュメント
- 使用例とベンチマーク

## プロジェクト完了

このフェーズ完了により、以下が達成されます：
- IEEE 754標準に完全準拠した単精度浮動小数点数型
- 標準float32型と同等の機能
- 教育目的と実用性を兼ね備えた実装
- 浮動小数点演算の深い理解

完成した Float32 型は、浮動小数点数の内部構造と演算メカニズムを理解するための優れた教材となり、同時に実用的な数値計算にも使用できる品質を持ちます。