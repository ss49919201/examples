package main

func binarySearch[T comparable](arr []T, v T) bool {
	if len(arr) == 0 {
		return false
	}
	if len(arr) == 1 {
		return arr[0] == v
	}

	mid := len(arr) / 2
	left := arr[0:mid]
	right := arr[mid:]

	if result := binarySearch(left, v); result {
		return result
	}

	if result := binarySearch(right, v); result {
		return result
	}

	return false
}
