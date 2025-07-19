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

type errT struct {
}

type ErrLevel int

const (
	ErrLevelFatal ErrLevel = iota
	ErrLevelError
	ErrLevelWarn
)

func (e *errT) Level() ErrLevel {
	return ErrLevelWarn
}

func (e *errT) Error() string {
	return ""
}

func newErrT() error {
	return &errT{}
}

type ErrWithLevel interface {
	Level() ErrLevel
}

func main() {
	e := newErrT()
	if eWithLevel, ok := e.(ErrWithLevel); ok {
		fmt.Println(eWithLevel.Level())
	}
	return

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

func AsError[T any](err error) (bool, T) {
	var t T
	if errors.As(err, &t) {
		return true, t
	}
	return false, t
}
