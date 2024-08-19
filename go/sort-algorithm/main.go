package main

func selectSort(array []int) []int {
	if len(array) <= 1 {
		return array
	}

	var minIndex int
	minVal := array[0]
	for i, v := range array[1:] {
		if v < minVal {
			minVal = v
			minIndex = i + 1
		}
	}

	return append(
		[]int{minVal},
		selectSort(append(array[:minIndex], array[minIndex+1:]...))...,
	)
}

func main() {
	array := []int{3, 2, 1, 5, 4}
	array = selectSort(array)
	for _, v := range array {
		println(v)
	}

	array = []int{0, 0, 9, 2, 3, 10, 1}
	array = selectSort(array)
	for _, v := range array {
		println(v)
	}
}
