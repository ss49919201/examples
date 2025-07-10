# フェーズ4: 比較演算の実装

## 目標
IEEE 754標準に準拠した比較演算を実装し、Float32型をソートや条件分岐で使用可能にする。

## 前提条件
- フェーズ1-3の基本機能が完了していること
- 特殊値の判定機能が利用可能であること
- 四則演算が正しく動作していること

## 実装タスク

### 1. 基本比較演算

#### 1.1 等価判定
```go
func (f Float32) Equal(other Float32) bool
func (f Float32) NotEqual(other Float32) bool
```

**実装詳細：**
- ビット単位での完全一致判定
- 特殊値の処理：
  - NaN == NaN → false (IEEE 754標準)
  - +0 == -0 → true
  - +Inf == +Inf → true
  - -Inf == -Inf → true

#### 1.2 大小比較
```go
func (f Float32) Greater(other Float32) bool
func (f Float32) GreaterEqual(other Float32) bool
func (f Float32) Less(other Float32) bool
func (f Float32) LessEqual(other Float32) bool
```

**実装詳細：**
- 符号による場合分け
- 指数部の比較
- 仮数部の比較
- 特殊値の処理

### 2. 特殊値を考慮した比較

#### 2.1 NaN (Not a Number) の処理
```go
func (f Float32) IsNaN() bool
func (f Float32) IsSignalingNaN() bool
func (f Float32) IsQuietNaN() bool
```

**IEEE 754標準の規則：**
- NaN と任意の値の比較は常に false
- NaN == NaN も false
- IsNaN() のみが NaN に対して true を返す

#### 2.2 無限大の処理
```go
func (f Float32) IsInf() bool
func (f Float32) IsPositiveInf() bool
func (f Float32) IsNegativeInf() bool
```

**比較規則：**
- +Inf > 任意の有限数
- -Inf < 任意の有限数
- +Inf == +Inf → true
- -Inf == -Inf → true
- +Inf > -Inf → true

#### 2.3 ゼロの処理
```go
func (f Float32) IsZero() bool
func (f Float32) IsPositiveZero() bool
func (f Float32) IsNegativeZero() bool
```

**比較規則：**
- +0 == -0 → true
- +0 と -0 の符号は区別される（内部的に）
- 他の演算では符号が重要

### 3. 順序比較 (Ordering)

#### 3.1 完全順序比較
```go
func (f Float32) Compare(other Float32) int
// 戻り値: -1 (f < other), 0 (f == other), 1 (f > other)
```

#### 3.2 部分順序比較（NaN考慮）
```go
func (f Float32) ComparePartial(other Float32) (int, bool)
// 戻り値: (比較結果, 比較可能かどうか)
```

### 4. ソート対応

#### 4.1 sort.Interface の実装
```go
type Float32Slice []Float32

func (s Float32Slice) Len() int
func (s Float32Slice) Less(i, j int) bool
func (s Float32Slice) Swap(i, j int)
```

#### 4.2 カスタムソート関数
```go
func Sort(slice []Float32)
func SortDescending(slice []Float32)
func SortWithNaN(slice []Float32, nanFirst bool)
```

### 5. 近似比較

#### 5.1 浮動小数点数の近似比較
```go
func (f Float32) ApproxEqual(other Float32, tolerance Float32) bool
func (f Float32) ApproxEqualULPs(other Float32, maxULPs uint32) bool
```

**実装方式：**
- 絶対誤差による比較
- 相対誤差による比較
- ULPs (Unit in the Last Place) による比較

#### 5.2 イプシロン比較
```go
const (
    DefaultEpsilon = 1e-7
    MachineEpsilon = 1.19209290e-7  // 2^-23
)

func (f Float32) EpsilonEqual(other Float32, epsilon Float32) bool
```

### 6. 範囲判定

#### 6.1 範囲チェック
```go
func (f Float32) InRange(min, max Float32) bool
func (f Float32) Clamp(min, max Float32) Float32
```

#### 6.2 境界値判定
```go
func (f Float32) IsSubnormal() bool
func (f Float32) IsNormal() bool
func (f Float32) IsFinite() bool
```

## 実装順序

1. **基本比較演算** (90分)
   - Equal, NotEqual の実装
   - Greater, Less, GreaterEqual, LessEqual の実装
   - 基本テストケース作成

2. **特殊値の比較処理** (120分)
   - NaN の比較規則実装
   - 無限大の比較処理
   - ゼロの符号処理
   - 特殊値テストケース作成

3. **順序比較とソート** (90分)
   - Compare メソッドの実装
   - sort.Interface の実装
   - カスタムソート関数の実装

4. **近似比較機能** (75分)
   - 各種近似比較の実装
   - イプシロン比較の実装
   - 精度テストケース作成

5. **範囲判定と境界値** (45分)
   - 範囲チェック機能の実装
   - 境界値判定の実装
   - 統合テスト

## テスト計画

### 単体テスト
- [ ] 基本比較演算テスト
  - 正常な数値同士の比較
  - 同じ値の比較
  - 異なる符号の比較
- [ ] 特殊値比較テスト
  - NaN との比較
  - 無限大との比較
  - ゼロとの比較
- [ ] 近似比較テスト
  - 浮動小数点誤差の処理
  - ULPs比較の正確性

### 統合テスト
- [ ] ソート機能テスト
  - 通常の数値配列
  - 特殊値を含む配列
  - 大きなデータセット
- [ ] 標準float32との比較テスト
- [ ] パフォーマンステスト

### 境界値テスト
- [ ] 最大値・最小値での比較
- [ ] 非正規化数での比較
- [ ] 符号境界での比較

## 成果物

1. **完全な比較機能**
   - IEEE 754準拠の比較演算
   - 特殊値の適切な処理
   - ソート対応

2. **テストファイル**
   - `phase4_test.go`
   - ベンチマークテスト

3. **使用例とドキュメント**
   - 各比較演算の使用例
   - ソート機能の使用例

## 使用例

```go
// 基本的な比較
a := NewFromInt32(10)
b := NewFromInt32(20)
c := NewFromInt32(10)

fmt.Println(a.Equal(c))        // true
fmt.Println(a.Less(b))         // true
fmt.Println(a.Greater(b))      // false
fmt.Println(a.LessEqual(c))    // true

// 特殊値の比較
nan := NewNaN()
inf := NewInf(1)
zero := NewZero(0)

fmt.Println(nan.Equal(nan))    // false (IEEE 754標準)
fmt.Println(inf.Greater(a))    // true
fmt.Println(zero.Equal(NewZero(1)))  // true (+0 == -0)

// 近似比較
x := NewFromInt32(1).Div(NewFromInt32(3))  // 0.333...
y := ParseFloat32("0.333333")
fmt.Println(x.ApproxEqual(y, NewFromFloat32(1e-6)))  // true

// ソート
values := []Float32{
    NewFromInt32(3),
    NewFromInt32(1),
    NewFromInt32(4),
    NewFromInt32(2),
}
Sort(values)
// values は [1, 2, 3, 4] の順序になる

// 範囲チェック
value := NewFromInt32(15)
min := NewFromInt32(10)
max := NewFromInt32(20)
fmt.Println(value.InRange(min, max))  // true

// 境界値判定
fmt.Println(inf.IsFinite())      // false
fmt.Println(a.IsNormal())        // true
fmt.Println(zero.IsZero())       // true
```

## パフォーマンス考慮

### 最適化ポイント
1. **頻繁な比較の最適化**
   - 特殊値の早期判定
   - ビット比較の活用

2. **ソート最適化**
   - 複数回の比較を避ける
   - キャッシュフレンドリーな実装

3. **分岐予測**
   - 共通ケースの優先処理
   - 特殊値の処理順序

### 制約事項
- 標準float32より比較が遅い
- 特殊値の処理でオーバーヘッドが発生

## 次フェーズへの準備

このフェーズ完了後、以下が利用可能になります：
- 完全な比較機能
- ソート対応
- 条件分岐での使用
- 近似比較機能

これらにより、フェーズ5で特殊値の処理を完成させ、実用的な浮動小数点数型を完成させることができます。