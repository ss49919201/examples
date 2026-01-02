package sort

import "testing"

// func Test_partition(t *testing.T) {
// 	t.Run("log", func(t *testing.T) {
// 		tests := [][]int{
// 			{4, 1, 2, 5, 1},
// 			{5, 4, 3, 2, 1},
// 			{4, 4, 4},
// 			{4, 1},
// 			{1},
// 		}

// 		for _, test := range tests {
// 			if len(test) > 0 {
// 				pivot := partition(test, 0, len(test)-1)
// 				t.Log(pivot)
// 			}
// 		}
// 	})
// }

func TestQuick(t *testing.T) {
	tests := [][]int{
		{},
		{1},
		{1, 2},
		{2, 1},
		{2, 2},
		{4, 3, 2, 1},
		{1, 2, 3, 4},
		{1, 1, 1, 1},
		{4, 2, 1, 3},
		{1, 2, 3},
		{1, 2, 2},
		{2, 2, 2},
		{3, 1, 2},
		{5, 1, 2, 3},
		{1, 2, 3, 5},
		{2, 2, 2, 2, 2},
		// 失敗するテストケース
		{7, 3, 1, 9, 5, 4, 8, 2, 6},     // 大きな配列
		{10, 1, 15, 3, 8, 2, 12, 7, 6},  // ランダムな順序
		{9, 8, 7, 6, 5, 4, 3, 2, 1, 0},  // 完全逆順
		{100, 1, 50, 25, 75, 10},        // 大きな値の差
		{3, 3, 1, 3, 2, 3, 1, 3},        // 重複値多数
	}

	t.Run("", func(t *testing.T) {
		for _, test := range tests {
			t.Log(Quick(test))
		}
	})
}
