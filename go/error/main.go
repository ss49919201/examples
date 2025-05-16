package main

import (
	"errors"
	"fmt"
)

type E1 struct{}

func (e *E1) Error() string {
	return "E1 error"
}

func fn(err error) {
	err = errors.New("override!")
}

func main() {
	// var e1 *E1
	var e1 error = fmt.Errorf("%w", &E1{})
	var e2 error = &E1{}
	println(errors.Is(e1, e2))
	println(errors.Is(e1, e2))

	println(e1.Error())
	fn(e1)
	println(e1.Error())
}
