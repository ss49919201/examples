package main

import (
	"cmp"
	"fmt"
)

func fn() (err error) {
	var e error
	return e
}

type e struct {
}

func (e *e) Error() string {
	return ""
}

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

	fmt.Println(fn() == nil)
}
