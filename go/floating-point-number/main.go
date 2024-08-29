package main

type bit struct {
	value uint8
}

type float32 struct {
	sign     bit
	exponent [2]bit
	fraction [23]bit
}

func main() {
	_ = float32{
		sign:     bit{0}, // 0 for positive, 1 for negative
		exponent: [2]bit{{0}, {0}},
		fraction: [23]bit{{0}},
	}

}
