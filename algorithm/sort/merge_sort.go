package sort

// 最悪、平均共に O(N logN)
// 安定ソート
func mergeSort(arr []int) []int {
	if len(arr) < 2 {
		return arr
	}

	midIdx := len(arr) / 2
	return merge(
		mergeSort(arr[:midIdx]),
		mergeSort(arr[midIdx:]),
	)
}

func merge(left []int, right []int) []int {
	result := make([]int, 0, len(left)+len(right))
	leftIdx, rightIdx := 0, 0
	for leftIdx < len(left) && rightIdx < len(right) {
		if left[leftIdx] <= right[rightIdx] {
			result = append(result, left[leftIdx])
			leftIdx++
		} else {
			result = append(result, right[rightIdx])
			rightIdx++
		}
	}

	if leftIdx == len(left) {
		result = append(result, right[rightIdx:]...)
	} else {
		result = append(result, left[leftIdx:]...)
	}

	return result
}
