# フェーズ3: 基本演算の実装

## 目標
IEEE 754標準に準拠した四則演算（加算、減算、乗算、除算）を実装する。

## 前提条件
- フェーズ1の基本構造とビット操作機能が完了していること
- フェーズ2の変換機能が完了していること
- 正規化と特殊値判定機能が利用可能であること

## 実装タスク

### 1. 加算演算 (Add)

#### 1.1 メソッド定義
```go
func (f Float32) Add(other Float32) Float32
func (f Float32) AddAssign(other Float32) // f += other
```

#### 1.2 実装アルゴリズム
1. **特殊値の処理**
   - NaN + 任意 = NaN
   - Inf + Inf = Inf (同符号), NaN (異符号)
   - Inf + 有限数 = Inf

2. **指数部の調整**
   - 指数部の差を計算
   - 小さい方の仮数部をシフト
   - 指数部を大きい方に合わせる

3. **仮数部の加算**
   - 隠れビット（1.xxx）を明示的に処理
   - 符号に応じて加算または減算
   - 結果のオーバーフロー/アンダーフローを処理

4. **結果の正規化**
   - 先頭ビットを1の位置に調整
   - 指数部を調整
   - 丸めの処理

### 2. 減算演算 (Sub)

#### 2.1 メソッド定義
```go
func (f Float32) Sub(other Float32) Float32
func (f Float32) SubAssign(other Float32) // f -= other
```

#### 2.2 実装アルゴリズム
1. **符号反転による加算への変換**
   - other.sign を反転
   - Add(other) を呼び出し

2. **直接実装（最適化版）**
   - 絶対値の比較
   - 大きい方から小さい方を引く
   - 結果の符号を決定

### 3. 乗算演算 (Mul)

#### 3.1 メソッド定義
```go
func (f Float32) Mul(other Float32) Float32
func (f Float32) MulAssign(other Float32) // f *= other
```

#### 3.2 実装アルゴリズム
1. **特殊値の処理**
   - NaN × 任意 = NaN
   - Inf × 0 = NaN
   - Inf × 非零有限数 = Inf

2. **符号の決定**
   - 符号ビットのXOR演算

3. **指数部の処理**
   - 指数部の加算 (exp1 + exp2 - 127)
   - オーバーフロー/アンダーフローの検出

4. **仮数部の乗算**
   - 23ビット × 23ビット = 46ビット
   - 上位24ビットを取得
   - 丸めの処理

### 4. 除算演算 (Div)

#### 4.1 メソッド定義
```go
func (f Float32) Div(other Float32) Float32
func (f Float32) DivAssign(other Float32) // f /= other
```

#### 4.2 実装アルゴリズム
1. **特殊値の処理**
   - NaN ÷ 任意 = NaN
   - Inf ÷ Inf = NaN
   - 有限数 ÷ 0 = Inf
   - 0 ÷ 0 = NaN

2. **符号の決定**
   - 符号ビットのXOR演算

3. **指数部の処理**
   - 指数部の減算 (exp1 - exp2 + 127)
   - オーバーフロー/アンダーフローの検出

4. **仮数部の除算**
   - 長除算アルゴリズム
   - 24ビット精度の保持
   - 丸めの処理

### 5. 丸め処理

#### 5.1 丸めモード
```go
type RoundingMode int

const (
    RoundToNearest RoundingMode = iota  // IEEE 754デフォルト
    RoundToZero                         // 切り捨て
    RoundToPositiveInf                  // 正の無限大方向
    RoundToNegativeInf                  // 負の無限大方向
)
```

#### 5.2 丸め実装
```go
func roundToNearest(mantissa uint64, guardBit, roundBit, stickyBit bool) uint32
func detectStickyBit(mantissa uint64, shift int) bool
```

### 6. エラーハンドリング

#### 6.1 例外フラグ
```go
type ExceptionFlags struct {
    Invalid    bool  // 無効な演算
    DivByZero  bool  // ゼロ除算
    Overflow   bool  // オーバーフロー
    Underflow  bool  // アンダーフロー
    Inexact    bool  // 不正確な結果
}
```

#### 6.2 例外検出
```go
func (f Float32) GetExceptionFlags() ExceptionFlags
func clearExceptionFlags()
```

## 実装順序

1. **加算演算の実装** (150分)
   - 特殊値処理
   - 指数部調整
   - 仮数部加算
   - 正規化処理
   - テストケース作成

2. **減算演算の実装** (90分)
   - 符号反転による加算変換
   - 直接実装の最適化
   - テストケース作成

3. **乗算演算の実装** (120分)
   - 符号と指数部の処理
   - 仮数部乗算
   - 丸め処理
   - テストケース作成

4. **除算演算の実装** (180分)
   - 特殊値処理
   - 長除算アルゴリズム
   - 丸め処理
   - テストケース作成

5. **丸めとエラーハンドリング** (90分)
   - 各種丸めモードの実装
   - 例外フラグの実装
   - 統合テスト

## テスト計画

### 単体テスト
- [ ] 加算演算テスト
  - 同符号、異符号
  - 指数部が同じ/異なる場合
  - 特殊値との演算
- [ ] 減算演算テスト
  - 結果が正/負/ゼロになる場合
  - 桁落ちの処理
- [ ] 乗算演算テスト
  - 正規化数同士
  - 非正規化数との演算
  - オーバーフロー/アンダーフロー
- [ ] 除算演算テスト
  - 正確に割り切れる場合
  - 循環小数になる場合
  - ゼロ除算

### 精度テスト
- [ ] 標準float32との比較
- [ ] 丸めの正確性
- [ ] 連続演算の精度劣化

### 境界値テスト
- [ ] 最大値/最小値での演算
- [ ] 非正規化数での演算
- [ ] 特殊値の組み合わせ

## 成果物

1. **完全な四則演算機能**
   - IEEE 754準拠の加算、減算、乗算、除算
   - 適切な丸め処理
   - 特殊値の正しい処理

2. **テストファイル**
   - `phase3_test.go`
   - 精度テストとベンチマーク

3. **使用例とドキュメント**
   - 各演算の使用例
   - パフォーマンス特性

## 使用例

```go
// 基本的な四則演算
a := NewFromInt32(10)
b := NewFromInt32(3)

sum := a.Add(b)        // 13.0
diff := a.Sub(b)       // 7.0
product := a.Mul(b)    // 30.0
quotient := a.Div(b)   // 3.333...

// 代入演算
a.AddAssign(b)         // a += b
a.SubAssign(b)         // a -= b
a.MulAssign(b)         // a *= b
a.DivAssign(b)         // a /= b

// 特殊値の処理
inf := NewInf(1)       // +Inf
nan := inf.Sub(inf)    // NaN
zero := NewZero(0)     // +0
divByZero := a.Div(zero)  // +Inf

// 丸めの確認
result := a.Div(b)
fmt.Printf("Result: %s\n", result.String())
```

## パフォーマンス考慮

### 最適化ポイント
1. **頻繁な操作の最適化**
   - ビット操作の高速化
   - 不要な正規化処理の削減

2. **メモリ効率**
   - 一時変数の最小化
   - インライン化の活用

3. **分岐予測**
   - 特殊値判定の順序最適化
   - 共通パスの優先

## 次フェーズへの準備

このフェーズ完了後、以下が利用可能になります：
- 実用的な四則演算機能
- IEEE 754準拠の精度
- 適切なエラーハンドリング

これらにより、フェーズ4の比較演算とフェーズ5の特殊値処理を実装し、完全な浮動小数点数型を完成させることができます。