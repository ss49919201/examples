package main

import (
	"cmp"
	"fmt"
)

func main() {
	fmt.Println(cmp.Or(
		"",
		"foo",
		"bar",
	))

	var s *string
	var s2 string = "not nil"
	fmt.Println(*cmp.Or(
		s,
		&s2,
	))
}
