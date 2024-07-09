package main

import (
	"fmt"
	. "strconv"
)

var unicode = map[rune]uint{
	'あ': 12354,
}

func parseInt(s string) int64 {
	i, _ := ParseInt(s, 2, 64)
	return i
}

func runeToUnicode(r rune) uint {
	return unicode[r]
}

func runeToUtf8(r rune) string {
	unicode := runeToUnicode(r)
	bytes := fmt.Sprintf("%016b", unicode)
	return fmt.Sprintf(
		"%x %x %x",
		parseInt("1110"+bytes[:4]),
		parseInt("10"+bytes[4:10]),
		parseInt("10"+bytes[10:16]),
	)
}

func main() {
	fmt.Println(runeToUtf8('あ'))
}
