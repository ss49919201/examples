package main

import (
	"sync"
	"time"
)

func f(wg *sync.WaitGroup) {
	for i := 0; i < 10; i++ {
		time.Sleep(time.Microsecond)
		println(i)
	}
	wg.Done()
}
func f2(wg *sync.WaitGroup) {
	for i := 0; i < 10; i++ {
		time.Sleep(time.Microsecond)
		println(i + 10)
	}
	wg.Done()
}

func main() {
	var (
		wg1 sync.WaitGroup
		wg2 sync.WaitGroup
	)

	wg1.Add(1)
	wg2.Add(1)

	go f2(&wg2)
	go f(&wg1)

	wg1.Wait()
	wg2.Wait()

	println("done")
}
