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

// Lomuto分割方式
func lomutoPartition(arr []int, low, high int) int {
	// 真ん中の要素をピボットとして選択し、最後に移動
	mid := low + (high-low)/2
	arr[mid], arr[high] = arr[high], arr[mid]

	pivot := arr[high] // 最後の要素をピボットに
	i := low - 1       // 小さい要素のインデックス

	// ピボット値より小さい要素を左側に移動
	for j := low; j < high; j++ {
		if arr[j] <= pivot {
			i++
			arr[i], arr[j] = arr[j], arr[i]
		}
	}

	// ピボット要素を正しい位置に配置
	i++
	arr[i], arr[high] = arr[high], arr[i]
	return i // ピボットの最終位置
}
