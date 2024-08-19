package main

func selectSort(array []int) {
	for i := 0; i < len(array)-1; i++ {
		// find min index
		minIndex := i
		minVal := array[minIndex]
		for j, v := range array[i:] {
			if v < minVal {
				minVal = v
				minIndex = j + i
			}
		}

		// swap
		array[i], array[minIndex] = array[minIndex], array[i]
	}
}

func main() {
	array := []int{3, 2, 1, 5, 4}
	selectSort(array)
	for _, v := range array {
		println(v)
	}

	array = []int{0, 0, 9, 2, 3, 10, 1}
	selectSort(array)
	for _, v := range array {
		println(v)
	}
}
