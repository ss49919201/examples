package main

import (
	"fmt"
	"math"
	"strconv"
	"strings"
)

type bit struct {
	value uint8 // 0 or 1
}

func (b *bit) Set(value uint8) {
	if value == 0 {
		b.value = 0
	} else {
		b.value = 1
	}
}

func (b bit) Get() uint8 {
	return b.value
}

func (b bit) String() string {
	if b.value == 0 {
		return "0"
	}
	return "1"
}

// 10進数の少数点数には、2進数で表現できない数がある
type Float32 struct {
	sign     bit
	exponent [8]bit  // 指数部
	fraction [23]bit // 仮数部

	// 仮数 * 2^指数
}

// 符号ビットの操作
func (f *Float32) SetSign(sign uint8) {
	f.sign.Set(sign)
}

func (f Float32) GetSign() uint8 {
	return f.sign.Get()
}

// 指数部の操作
func (f *Float32) SetExponent(exp uint8) {
	for i := 0; i < 8; i++ {
		f.exponent[i].Set((exp >> (7 - i)) & 1)
	}
}

func (f Float32) GetExponent() uint8 {
	var exp uint8
	for i := 0; i < 8; i++ {
		exp |= f.exponent[i].Get() << (7 - i)
	}
	return exp
}

// 仮数部の操作
func (f *Float32) SetFractionBit(index int, value uint8) {
	if index >= 0 && index < 23 {
		f.fraction[index].Set(value)
	}
}

func (f Float32) GetFractionBit(index int) uint8 {
	if index >= 0 && index < 23 {
		return f.fraction[index].Get()
	}
	return 0
}

// 32ビット全体との変換
func (f *Float32) FromBits(bits uint32) {
	f.SetSign(uint8((bits >> 31) & 1))
	f.SetExponent(uint8((bits >> 23) & 0xFF))
	
	for i := 0; i < 23; i++ {
		f.SetFractionBit(i, uint8((bits>>(22-i))&1))
	}
}

func (f Float32) ToBits() uint32 {
	var bits uint32
	bits |= uint32(f.GetSign()) << 31
	bits |= uint32(f.GetExponent()) << 23
	
	for i := 0; i < 23; i++ {
		bits |= uint32(f.GetFractionBit(i)) << (22 - i)
	}
	return bits
}

// ビット表現の文字列化
func (f Float32) BinaryString() string {
	result := f.sign.String() + "_"
	
	for i := 0; i < 8; i++ {
		result += f.exponent[i].String()
	}
	result += "_"
	
	for i := 0; i < 23; i++ {
		result += f.fraction[i].String()
	}
	return result
}

// 正規化チェック
func (f Float32) IsNormalized() bool {
	exp := f.GetExponent()
	return exp != 0 && exp != 255
}

func (f Float32) IsZero() bool {
	exp := f.GetExponent()
	if exp != 0 {
		return false
	}
	
	for i := 0; i < 23; i++ {
		if f.GetFractionBit(i) != 0 {
			return false
		}
	}
	return true
}

func (f Float32) IsSubnormal() bool {
	exp := f.GetExponent()
	if exp != 0 {
		return false
	}
	
	for i := 0; i < 23; i++ {
		if f.GetFractionBit(i) != 0 {
			return true
		}
	}
	return false
}

// 正規化処理
func (f *Float32) Normalize() {
	if f.IsZero() {
		return
	}
	
	exp := f.GetExponent()
	
	// 非正規化数の場合
	if exp == 0 {
		// 最初の1ビットを見つける
		leadingBit := -1
		for i := 0; i < 23; i++ {
			if f.GetFractionBit(i) == 1 {
				leadingBit = i
				break
			}
		}
		
		if leadingBit == -1 {
			return // オールゼロ
		}
		
		// 仮数部を左シフト
		f.shiftFraction(leadingBit + 1)
		
		// 指数部を調整
		newExp := 1 - leadingBit
		if newExp > 0 && newExp < 255 {
			f.SetExponent(uint8(newExp))
		}
	}
}

// 仮数部のシフト
func (f *Float32) shiftFraction(positions int) {
	if positions == 0 {
		return
	}
	
	if positions > 0 {
		// 左シフト
		for i := 0; i < 23-positions; i++ {
			f.SetFractionBit(i, f.GetFractionBit(i+positions))
		}
		for i := 23 - positions; i < 23; i++ {
			f.SetFractionBit(i, 0)
		}
	} else {
		// 右シフト
		positions = -positions
		for i := 22; i >= positions; i-- {
			f.SetFractionBit(i, f.GetFractionBit(i-positions))
		}
		for i := 0; i < positions; i++ {
			f.SetFractionBit(i, 0)
		}
	}
}

// 指数部の調整
func (f *Float32) adjustExponent(delta int) {
	currentExp := int(f.GetExponent())
	newExp := currentExp + delta
	
	if newExp <= 0 {
		f.SetExponent(0)
	} else if newExp >= 255 {
		f.SetExponent(255)
	} else {
		f.SetExponent(uint8(newExp))
	}
}

// 基本コンストラクタ
func NewFloat32() Float32 {
	return Float32{
		sign:     bit{0},
		exponent: [8]bit{},
		fraction: [23]bit{},
	}
}

func NewFloat32FromBits(bits uint32) Float32 {
	var f Float32
	f.FromBits(bits)
	return f
}

func NewFloat32Zero() Float32 {
	return NewFloat32()
}

func NewFloat32One() Float32 {
	var f Float32
	f.FromBits(0x3F800000) // 1.0 in IEEE 754
	return f
}

// デバッグ用機能
func (f Float32) Debug() string {
	return fmt.Sprintf("Float32{ sign: %s, exponent: %d (0x%02X), fraction: %s, binary: %s }",
		f.sign.String(),
		f.GetExponent(),
		f.GetExponent(),
		f.fractionBitsString(),
		f.BinaryString())
}

func (f Float32) ComponentsString() string {
	return fmt.Sprintf("Sign: %s, Exponent: %d, Fraction: %s",
		f.sign.String(),
		f.GetExponent(),
		f.fractionBitsString())
}

func (f Float32) fractionBitsString() string {
	var result string
	for i := 0; i < 23; i++ {
		result += f.fraction[i].String()
	}
	return result
}

// 整数からFloat32への変換
func NewFromInt32(value int32) Float32 {
	if value == 0 {
		return NewFloat32Zero()
	}
	
	var f Float32
	
	// 符号の処理
	if value < 0 {
		f.SetSign(1)
		value = -value
	} else {
		f.SetSign(0)
	}
	
	// 最上位ビットの位置を見つける
	uValue := uint32(value)
	leadingBit := 31
	for i := 31; i >= 0; i-- {
		if (uValue >> i) & 1 == 1 {
			leadingBit = i
			break
		}
	}
	
	// 指数部の計算 (127 + leadingBit)
	exponent := 127 + leadingBit
	if exponent >= 255 {
		// オーバーフロー - 無限大
		f.SetExponent(255)
		return f
	}
	f.SetExponent(uint8(exponent))
	
	// 仮数部の構築
	// 最上位ビットは暗黙的なので除く
	if leadingBit > 0 {
		shift := leadingBit - 23
		if shift > 0 {
			// 右シフト（丸めあり）
			uValue >>= shift
		} else if shift < 0 {
			// 左シフト
			uValue <<= -shift
		}
		
		// 最上位ビットを除いて仮数部に設定
		for i := 0; i < 23; i++ {
			bit := (uValue >> (22 - i)) & 1
			f.SetFractionBit(i, uint8(bit))
		}
	}
	
	return f
}

func NewFromInt64(value int64) Float32 {
	// int64の範囲チェック
	if value > math.MaxInt32 || value < math.MinInt32 {
		// 範囲外の場合は近似値
		return NewFromInt32(int32(value >> 32))
	}
	return NewFromInt32(int32(value))
}

func NewFromUint32(value uint32) Float32 {
	if value == 0 {
		return NewFloat32Zero()
	}
	
	var f Float32
	f.SetSign(0)
	
	// 最上位ビットの位置を見つける
	leadingBit := 31
	for i := 31; i >= 0; i-- {
		if (value >> i) & 1 == 1 {
			leadingBit = i
			break
		}
	}
	
	// 指数部の計算
	exponent := 127 + leadingBit
	if exponent >= 255 {
		f.SetExponent(255)
		return f
	}
	f.SetExponent(uint8(exponent))
	
	// 仮数部の構築
	if leadingBit > 0 {
		shift := leadingBit - 23
		if shift > 0 {
			value >>= shift
		} else if shift < 0 {
			value <<= -shift
		}
		
		for i := 0; i < 23; i++ {
			bit := (value >> (22 - i)) & 1
			f.SetFractionBit(i, uint8(bit))
		}
	}
	
	return f
}

func NewFromUint64(value uint64) Float32 {
	if value > math.MaxUint32 {
		return NewFromUint32(uint32(value >> 32))
	}
	return NewFromUint32(uint32(value))
}

// Float32から整数への変換
func (f Float32) ToInt32() (int32, error) {
	// 特殊値のチェック
	if f.IsZero() {
		return 0, nil
	}
	
	exp := f.GetExponent()
	if exp == 255 {
		return 0, fmt.Errorf("cannot convert infinity or NaN to integer")
	}
	
	// 指数部の計算
	realExp := int(exp) - 127
	
	// 整数部がない場合
	if realExp < 0 {
		return 0, nil
	}
	
	// オーバーフローチェック
	if realExp > 31 {
		return 0, fmt.Errorf("overflow: value too large for int32")
	}
	
	// 仮数部の構築（暗黙の1を含む）
	mantissa := uint64(1) << 23 // 暗黙の1
	for i := 0; i < 23; i++ {
		if f.GetFractionBit(i) == 1 {
			mantissa |= uint64(1) << (22 - i)
		}
	}
	
	// 適切な位置にシフト
	var result uint64
	if realExp >= 23 {
		result = mantissa << (realExp - 23)
	} else {
		result = mantissa >> (23 - realExp)
	}
	
	// int32の範囲チェック
	if result > math.MaxInt32 {
		return 0, fmt.Errorf("overflow: value too large for int32")
	}
	
	// 符号の適用
	if f.GetSign() == 1 {
		return -int32(result), nil
	}
	return int32(result), nil
}

func (f Float32) ToInt64() (int64, error) {
	// 特殊値のチェック
	if f.IsZero() {
		return 0, nil
	}
	
	exp := f.GetExponent()
	if exp == 255 {
		return 0, fmt.Errorf("cannot convert infinity or NaN to integer")
	}
	
	realExp := int(exp) - 127
	
	if realExp < 0 {
		return 0, nil
	}
	
	if realExp > 63 {
		return 0, fmt.Errorf("overflow: value too large for int64")
	}
	
	// 仮数部の構築
	mantissa := uint64(1) << 23
	for i := 0; i < 23; i++ {
		if f.GetFractionBit(i) == 1 {
			mantissa |= uint64(1) << (22 - i)
		}
	}
	
	var result uint64
	if realExp >= 23 {
		result = mantissa << (realExp - 23)
	} else {
		result = mantissa >> (23 - realExp)
	}
	
	if result > math.MaxInt64 {
		return 0, fmt.Errorf("overflow: value too large for int64")
	}
	
	if f.GetSign() == 1 {
		return -int64(result), nil
	}
	return int64(result), nil
}

func (f Float32) ToUint32() (uint32, error) {
	if f.GetSign() == 1 {
		return 0, fmt.Errorf("cannot convert negative value to unsigned integer")
	}
	
	if f.IsZero() {
		return 0, nil
	}
	
	exp := f.GetExponent()
	if exp == 255 {
		return 0, fmt.Errorf("cannot convert infinity or NaN to integer")
	}
	
	realExp := int(exp) - 127
	
	if realExp < 0 {
		return 0, nil
	}
	
	if realExp > 31 {
		return 0, fmt.Errorf("overflow: value too large for uint32")
	}
	
	mantissa := uint64(1) << 23
	for i := 0; i < 23; i++ {
		if f.GetFractionBit(i) == 1 {
			mantissa |= uint64(1) << (22 - i)
		}
	}
	
	var result uint64
	if realExp >= 23 {
		result = mantissa << (realExp - 23)
	} else {
		result = mantissa >> (23 - realExp)
	}
	
	if result > math.MaxUint32 {
		return 0, fmt.Errorf("overflow: value too large for uint32")
	}
	
	return uint32(result), nil
}

func (f Float32) ToUint64() (uint64, error) {
	if f.GetSign() == 1 {
		return 0, fmt.Errorf("cannot convert negative value to unsigned integer")
	}
	
	if f.IsZero() {
		return 0, nil
	}
	
	exp := f.GetExponent()
	if exp == 255 {
		return 0, fmt.Errorf("cannot convert infinity or NaN to integer")
	}
	
	realExp := int(exp) - 127
	
	if realExp < 0 {
		return 0, nil
	}
	
	if realExp > 63 {
		return 0, fmt.Errorf("overflow: value too large for uint64")
	}
	
	mantissa := uint64(1) << 23
	for i := 0; i < 23; i++ {
		if f.GetFractionBit(i) == 1 {
			mantissa |= uint64(1) << (22 - i)
		}
	}
	
	var result uint64
	if realExp >= 23 {
		result = mantissa << (realExp - 23)
	} else {
		result = mantissa >> (23 - realExp)
	}
	
	return result, nil
}

// 文字列からFloat32への変換
func ParseFloat32(s string) (Float32, error) {
	s = strings.TrimSpace(s)
	
	// 特殊値の処理
	switch strings.ToLower(s) {
	case "nan":
		return NewNaN(), nil
	case "inf", "+inf", "infinity", "+infinity":
		return NewInf(1), nil
	case "-inf", "-infinity":
		return NewInf(-1), nil
	case "0", "+0":
		return NewFloat32Zero(), nil
	case "-0":
		return NewNegativeZero(), nil
	}
	
	// 標準ライブラリを使用して解析
	val, err := strconv.ParseFloat(s, 32)
	if err != nil {
		return Float32{}, fmt.Errorf("invalid float32 string: %s", s)
	}
	
	// float32に変換してからビット表現を取得
	f32 := float32(val)
	bits := math.Float32bits(f32)
	
	return NewFloat32FromBits(bits), nil
}

// Float32から文字列への変換
func (f Float32) String() string {
	// 特殊値の処理
	exp := f.GetExponent()
	if exp == 255 {
		// NaN or Infinity
		allZeroFraction := true
		for i := 0; i < 23; i++ {
			if f.GetFractionBit(i) != 0 {
				allZeroFraction = false
				break
			}
		}
		
		if allZeroFraction {
			// Infinity
			if f.GetSign() == 1 {
				return "-Inf"
			}
			return "+Inf"
		} else {
			// NaN
			return "NaN"
		}
	}
	
	// ゼロの処理
	if f.IsZero() {
		if f.GetSign() == 1 {
			return "-0"
		}
		return "0"
	}
	
	// 標準float32に変換して文字列化
	bits := f.ToBits()
	stdFloat := math.Float32frombits(bits)
	return fmt.Sprintf("%g", stdFloat)
}

func (f Float32) Format(format string) string {
	// 特殊値の処理
	exp := f.GetExponent()
	if exp == 255 {
		allZeroFraction := true
		for i := 0; i < 23; i++ {
			if f.GetFractionBit(i) != 0 {
				allZeroFraction = false
				break
			}
		}
		
		if allZeroFraction {
			if f.GetSign() == 1 {
				return "-Inf"
			}
			return "+Inf"
		} else {
			return "NaN"
		}
	}
	
	if f.IsZero() {
		if f.GetSign() == 1 {
			return "-0"
		}
		return "0"
	}
	
	// 標準float32に変換してフォーマット
	bits := f.ToBits()
	stdFloat := math.Float32frombits(bits)
	return fmt.Sprintf(format, stdFloat)
}

// 特殊値の生成
func NewNaN() Float32 {
	var f Float32
	f.SetExponent(255)
	f.SetFractionBit(0, 1) // クワイエットNaN
	return f
}

func NewInf(sign int) Float32 {
	var f Float32
	if sign < 0 {
		f.SetSign(1)
	} else {
		f.SetSign(0)
	}
	f.SetExponent(255)
	// 仮数部は全て0（無限大）
	return f
}

func NewPositiveInf() Float32 {
	return NewInf(1)
}

func NewNegativeInf() Float32 {
	return NewInf(-1)
}

func NewNegativeZero() Float32 {
	var f Float32
	f.SetSign(1)
	// 指数部と仮数部は全て0
	return f
}

// 特殊値の判定
func (f Float32) IsNaN() bool {
	exp := f.GetExponent()
	if exp != 255 {
		return false
	}
	
	// 仮数部に0以外があるかチェック
	for i := 0; i < 23; i++ {
		if f.GetFractionBit(i) != 0 {
			return true
		}
	}
	return false
}

func (f Float32) IsInf() bool {
	exp := f.GetExponent()
	if exp != 255 {
		return false
	}
	
	// 仮数部が全て0かチェック
	for i := 0; i < 23; i++ {
		if f.GetFractionBit(i) != 0 {
			return false
		}
	}
	return true
}

func (f Float32) IsPositiveInf() bool {
	return f.IsInf() && f.GetSign() == 0
}

func (f Float32) IsNegativeInf() bool {
	return f.IsInf() && f.GetSign() == 1
}

func (f Float32) IsFinite() bool {
	return !f.IsNaN() && !f.IsInf()
}

// 分類関数
type FPClass int

const (
	FPNaN FPClass = iota
	FPInfinite
	FPZero
	FPSubnormal
	FPNormal
)

func (f Float32) Classify() FPClass {
	if f.IsNaN() {
		return FPNaN
	}
	if f.IsInf() {
		return FPInfinite
	}
	if f.IsZero() {
		return FPZero
	}
	if f.IsSubnormal() {
		return FPSubnormal
	}
	return FPNormal
}

func main() {
	fmt.Println("=== フェーズ2テスト: 変換機能の実装 ===")
	
	// 1. 整数からFloat32への変換テスト
	fmt.Println("\n1. 整数からFloat32への変換テスト")
	
	// 正の整数
	f42 := NewFromInt32(42)
	fmt.Printf("NewFromInt32(42): %s\n", f42.String())
	fmt.Printf("詳細: %s\n", f42.Debug())
	
	// 負の整数
	fNeg := NewFromInt32(-123)
	fmt.Printf("NewFromInt32(-123): %s\n", fNeg.String())
	
	// 大きな数
	fBig := NewFromUint32(1000000)
	fmt.Printf("NewFromUint32(1000000): %s\n", fBig.String())
	
	// 2. Float32から整数への変換テスト
	fmt.Println("\n2. Float32から整数への変換テスト")
	
	// 正常な変換
	if val, err := f42.ToInt32(); err == nil {
		fmt.Printf("Float32(42) -> int32: %d\n", val)
	}
	
	// 負の数の変換
	if val, err := fNeg.ToInt32(); err == nil {
		fmt.Printf("Float32(-123) -> int32: %d\n", val)
	}
	
	// 小数の変換（切り捨て）
	fTest, _ := ParseFloat32("3.14")
	if val, err := fTest.ToInt32(); err == nil {
		fmt.Printf("Float32(3.14) -> int32: %d\n", val)
	}
	
	// 3. 文字列からFloat32への変換テスト
	fmt.Println("\n3. 文字列からFloat32への変換テスト")
	
	// 基本的な数値
	if f314, err := ParseFloat32("3.14"); err == nil {
		fmt.Printf("ParseFloat32(\"3.14\"): %s\n", f314.String())
	}
	
	// 負の数
	if fNegFloat, err := ParseFloat32("-2.5"); err == nil {
		fmt.Printf("ParseFloat32(\"-2.5\"): %s\n", fNegFloat.String())
	}
	
	// 科学記法
	if fSci, err := ParseFloat32("1.23e2"); err == nil {
		fmt.Printf("ParseFloat32(\"1.23e2\"): %s\n", fSci.String())
	}
	
	// 特殊値
	if fNaN, err := ParseFloat32("NaN"); err == nil {
		fmt.Printf("ParseFloat32(\"NaN\"): %s\n", fNaN.String())
	}
	
	if fInf, err := ParseFloat32("Inf"); err == nil {
		fmt.Printf("ParseFloat32(\"Inf\"): %s\n", fInf.String())
	}
	
	// 4. 特殊値の生成と判定テスト
	fmt.Println("\n4. 特殊値の生成と判定テスト")
	
	nan := NewNaN()
	fmt.Printf("NewNaN(): %s, IsNaN: %t\n", nan.String(), nan.IsNaN())
	
	inf := NewPositiveInf()
	fmt.Printf("NewPositiveInf(): %s, IsInf: %t\n", inf.String(), inf.IsInf())
	
	negInf := NewNegativeInf()
	fmt.Printf("NewNegativeInf(): %s, IsNegativeInf: %t\n", negInf.String(), negInf.IsNegativeInf())
	
	negZero := NewNegativeZero()
	fmt.Printf("NewNegativeZero(): %s, IsZero: %t\n", negZero.String(), negZero.IsZero())
	
	// 5. 分類テスト
	fmt.Println("\n5. 分類テスト")
	
	values := []Float32{
		NewFromInt32(42),
		NewNaN(),
		NewPositiveInf(),
		NewFloat32Zero(),
		NewNegativeZero(),
	}
	
	classNames := []string{"Normal", "NaN", "Infinite", "Zero", "Zero"}
	
	for i, val := range values {
		fmt.Printf("%s: %s, 分類: %d\n", classNames[i], val.String(), val.Classify())
	}
	
	// 6. 標準float32との比較テスト
	fmt.Println("\n6. 標準float32との比較テスト")
	
	testValues := []string{"0", "1", "-1", "3.14", "-2.5", "1000000"}
	
	for _, str := range testValues {
		if f, err := ParseFloat32(str); err == nil {
			stdFloat, _ := strconv.ParseFloat(str, 32)
			stdBits := math.Float32bits(float32(stdFloat))
			customBits := f.ToBits()
			
			fmt.Printf("値: %s, 標準: 0x%08X, 自作: 0x%08X, 一致: %t\n", 
				str, stdBits, customBits, stdBits == customBits)
		}
	}
	
	// 7. エラーハンドリングテスト
	fmt.Println("\n7. エラーハンドリングテスト")
	
	// 不正な文字列
	if _, err := ParseFloat32("invalid"); err != nil {
		fmt.Printf("不正な文字列エラー: %v\n", err)
	}
	
	// NaNから整数への変換
	if _, err := nan.ToInt32(); err != nil {
		fmt.Printf("NaN変換エラー: %v\n", err)
	}
	
	// 無限大から整数への変換
	if _, err := inf.ToInt32(); err != nil {
		fmt.Printf("無限大変換エラー: %v\n", err)
	}
}
