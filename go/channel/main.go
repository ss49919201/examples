package main

type onlyRecieveChannel[T any] = chan<- T

func send[T any](ch onlyRecieveChannel[T], v T) {
	ch <- v
}

type onlySendChannel[T any] = <-chan T

func receive[T any](ch onlySendChannel[T]) T {
	return <-ch
}
