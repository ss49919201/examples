# フェーズ1: 基本構造の強化

## 目標
既存のFloat32構造体を拡張し、ビット操作のためのヘルパー関数と数値正規化機能を実装する。

## 実装タスク

### 1. ビット操作ヘルパー関数の実装

#### 1.1 bit構造体の拡張
```go
type bit struct {
    value uint8 // 0 or 1
}

// 新しいメソッドを追加
func (b *bit) Set(value uint8)
func (b bit) Get() uint8
func (b bit) String() string
```

#### 1.2 Float32のビット操作メソッド
```go
// 符号ビットの操作
func (f *Float32) SetSign(sign uint8)
func (f Float32) GetSign() uint8

// 指数部の操作
func (f *Float32) SetExponent(exp uint8)
func (f Float32) GetExponent() uint8

// 仮数部の操作
func (f *Float32) SetFractionBit(index int, value uint8)
func (f Float32) GetFractionBit(index int) uint8
```

#### 1.3 全体ビット操作メソッド
```go
// 32ビット全体との変換
func (f *Float32) FromBits(bits uint32)
func (f Float32) ToBits() uint32

// ビット表現の文字列化
func (f Float32) BinaryString() string
```

### 2. 数値正規化機能の実装

#### 2.1 正規化チェック
```go
func (f Float32) IsNormalized() bool
func (f Float32) IsZero() bool
func (f Float32) IsSubnormal() bool
```

#### 2.2 正規化処理
```go
func (f *Float32) Normalize()
func (f *Float32) normalizeAfterOperation()
```

#### 2.3 指数部と仮数部の調整
```go
func (f *Float32) adjustExponent(delta int)
func (f *Float32) shiftFraction(positions int)
```

### 3. 便利なコンストラクタ

#### 3.1 基本コンストラクタ
```go
func NewFloat32() Float32
func NewFloat32FromBits(bits uint32) Float32
func NewFloat32Zero() Float32
func NewFloat32One() Float32
```

#### 3.2 デバッグ用機能
```go
func (f Float32) Debug() string
func (f Float32) ComponentsString() string
```

## 実装順序

1. **bit構造体の拡張** (30分)
   - Set, Get, Stringメソッドの実装
   - 単体テストの作成

2. **Float32の基本ビット操作** (45分)
   - SetSign, GetSign, SetExponent, GetExponentの実装
   - 仮数部操作メソッドの実装

3. **ビット変換機能** (30分)
   - FromBits, ToBitsメソッドの実装
   - BinaryStringメソッドの実装

4. **正規化機能** (60分)
   - IsNormalized, IsZero, IsSubnormalの実装
   - Normalizeメソッドの実装

5. **コンストラクタと便利メソッド** (30分)
   - 各種コンストラクタの実装
   - デバッグ用メソッドの実装

## テスト計画

### 単体テスト
- [ ] bit構造体の各メソッドテスト
- [ ] Float32のビット操作メソッドテスト
- [ ] 正規化機能のテスト
- [ ] ビット変換の正確性テスト

### 統合テスト
- [ ] 複数のメソッドを組み合わせた動作テスト
- [ ] 境界値でのテスト

## 成果物

1. **拡張されたFloat32構造体**
   - 完全なビット操作機能
   - 正規化機能

2. **テストファイル**
   - `phase1_test.go`

3. **ドキュメント**
   - 実装されたメソッドの使用例
   - APIリファレンス

## 次フェーズへの準備

このフェーズ完了後、以下が利用可能になります：
- 完全なビット操作機能
- 数値の正規化機能
- デバッグとテストのための便利メソッド

これらの機能により、フェーズ2以降の変換機能と演算機能の実装が可能になります。