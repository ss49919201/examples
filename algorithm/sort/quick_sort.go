package sort

func Quick(arr []int) []int {
	if len(arr) <= 1 {
		return arr
	}
	quickSort(arr, 0, len(arr)-1)
	return arr
}

func quickSort(arr []int, low, high int) {
	if low < high {
		pi := hoarePartition(arr, low, high)
		quickSort(arr, low, pi)
		quickSort(arr, pi+1, high)
	}
}

// 重複関数を削除し、hoarePartitionに統一

// Hoare分割方式
func hoarePartition(arr []int, low, high int) int {
	pivot := low + (high-low)/2
	pivotValue := arr[pivot]

	left := low
	right := high

	for {
		for arr[left] < pivotValue {
			left++
		}

		for arr[right] > pivotValue {
			right--
		}

		// MEMO: 片方が pivot の添字まで進んでいる且つ、片方が添字との差分=1まで進んでいる場合に次のイテレートで交差する
		//
		// 配列: [1 3 2 4], pivotValue=3
		// iter 1:  i = 1 j = 2 → swap → incr → i = 2 j = 1
		// swap 後に i = 2 j = 1 になり交差
		if left >= right {
			// pivot 要素が swap されていることもあるので、
			// return pivot は NG
			return right
		}

		arr[right], arr[left] = arr[left], arr[right]
		left++
		right--
	}
}
