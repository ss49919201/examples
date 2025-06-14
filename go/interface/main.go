package main

import (
	"errors"
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

type notFoundErr struct {
	// time.Time
}

func (n *notFoundErr) Error() string { return "not found" }

func err() error {
	return &notFoundErr{
		// Time: time.Now(),
	}
}

func main() {
	empty1 := struct{ n int }{}
	empty2 := struct{ n int }{}
	fmt.Println(empty1 == empty2)

	empty1Ptr := &empty1
	empty2Ptr := &empty2
	fmt.Println(empty1Ptr == empty2Ptr)

	var empty1AsAny any = empty1
	var empty2AsAny any = empty2
	fmt.Println(empty1AsAny == empty2AsAny)

	var empty1PtrPtrAsAny any = &empty1Ptr
	var empty2PtrPtrAsAny any = &empty2Ptr
	fmt.Println(empty1PtrPtrAsAny == empty2PtrPtrAsAny)

	e := err()
	fmt.Println(errors.Is(e, &notFoundErr{}))
	fmt.Println(errors.Is(e, &notFoundErr{}))
}
