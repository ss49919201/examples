package main

import "cmp"

func binarySearch[T cmp.Ordered](arr []T, v T) bool {
	if len(arr) == 0 {
		return false
	}
	if len(arr) == 1 {
		return arr[0] == v
	}

	mid := len(arr) / 2

	if arr[mid] == v {
		return true
	} else if arr[mid] > v {
		return binarySearch(arr[0:mid], v)
	} else {
		return binarySearch(arr[mid+1:], v)
	}
}
