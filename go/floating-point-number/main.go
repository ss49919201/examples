package main

import (
	"fmt"
	"math"
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

func main() {
	fmt.Println("=== フェーズ1テスト: 基本構造の強化 ===")
	
	// 1. bit構造体のテスト
	fmt.Println("\n1. bit構造体のテスト")
	var b bit
	b.Set(1)
	fmt.Printf("Set(1): %s\n", b.String())
	fmt.Printf("Get(): %d\n", b.Get())
	
	b.Set(0)
	fmt.Printf("Set(0): %s\n", b.String())
	
	// 2. Float32基本構造のテスト
	fmt.Println("\n2. Float32基本構造のテスト")
	var f Float32
	f.SetSign(0)
	f.SetExponent(127) // バイアス値
	f.SetFractionBit(0, 1)
	
	fmt.Printf("符号: %d\n", f.GetSign())
	fmt.Printf("指数: %d\n", f.GetExponent())
	fmt.Printf("仮数の最初のビット: %d\n", f.GetFractionBit(0))
	
	// 3. ビット変換のテスト
	fmt.Println("\n3. ビット変換のテスト")
	one := NewFloat32One()
	fmt.Printf("1.0のビット表現: 0x%08X\n", one.ToBits())
	fmt.Printf("1.0のバイナリ表現: %s\n", one.BinaryString())
	fmt.Printf("1.0の詳細情報: %s\n", one.Debug())
	
	// 4. 標準float32との比較
	fmt.Println("\n4. 標準float32との比較")
	stdFloat := float32(1.0)
	stdBits := math.Float32bits(stdFloat)
	fmt.Printf("標準float32(1.0): 0x%08X\n", stdBits)
	fmt.Printf("自作Float32(1.0): 0x%08X\n", one.ToBits())
	fmt.Printf("一致: %t\n", stdBits == one.ToBits())
	
	// 5. FromBitsのテスト
	fmt.Println("\n5. FromBitsのテスト")
	var f2 Float32
	f2.FromBits(0x40400000) // 3.0
	fmt.Printf("0x40400000からの変換: %s\n", f2.Debug())
	
	// 6. 正規化のテスト
	fmt.Println("\n6. 正規化のテスト")
	zero := NewFloat32Zero()
	fmt.Printf("ゼロ判定: %t\n", zero.IsZero())
	fmt.Printf("正規化判定: %t\n", zero.IsNormalized())
	
	// 7. コンストラクタのテスト
	fmt.Println("\n7. コンストラクタのテスト")
	newOne := NewFloat32One()
	fmt.Printf("NewFloat32One(): %s\n", newOne.ComponentsString())
	
	newZero := NewFloat32Zero()
	fmt.Printf("NewFloat32Zero(): %s\n", newZero.ComponentsString())
	
	// 8. 0.6の表現確認（参考）
	fmt.Println("\n8. 0.6の表現確認")
	fmt.Printf("標準float32(0.6)のビット: %032b\n", math.Float32bits(0.6))
	
	var f06 Float32
	f06.FromBits(math.Float32bits(0.6))
	fmt.Printf("0.6の詳細情報: %s\n", f06.Debug())
}
