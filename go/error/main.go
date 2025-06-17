package main

import (
	"errors"
	"fmt"
)

type E1 struct {
	string
}

func (e *E1) Error() string {
	return "E1 error"
}

func (e *E1) CallStack() string {
	return "call stack"
}

func fn(err error) {
	err = errors.New("override!")
}

type SuperError interface {
	error
	CallStack() string
}

func main() {
	// var e1 *E1
	var e1 error = fmt.Errorf("%w", &E1{})
	var e2 error = &E1{}
	println(errors.Is(e1, e2))
	println(errors.Is(e1, e2))

	println(errors.Is(&E1{}, &E1{}))

	println(e1.Error())
	fn(e1)
	println(e1.Error())

	assertted, ok := e2.(SuperError)
	fmt.Println(assertted, ok)
}
