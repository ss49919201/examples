package main

type bit struct {
	value uint8 // 0 or 1
}

// 10進数の少数点数には、2進数で表現できない数がある
type float32 struct {
	sign     bit
	exponent [8]bit
	fraction [23]bit
}

func main() {
	_ = float32{
		sign:     bit{0}, // 0 for positive, 1 for negative
		exponent: [8]bit{{0}, {0}, {0}, {0}, {0}, {0}, {0}, {0}},
		fraction: [23]bit{
			{0}, {0}, {0}, {0}, {0}, {0}, {0}, {0},
			{0}, {0}, {0}, {0}, {0}, {0}, {0}, {0},
			{0}, {0}, {0}, {0}, {0}, {0}, {0},
		},
	}

}
