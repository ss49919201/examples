package sort

import (
	"reflect"
	"testing"
)

func Test_mergeSort(t *testing.T) {
	type args struct {
		arr []int
	}
	tests := []struct {
		name string
		args args
		want []int
	}{
		{
			"empty array",
			args{
				[]int{},
			},
			[]int{},
		},
		{
			"single element",
			args{
				[]int{1},
			},
			[]int{1},
		},
		{
			"two identical elements",
			args{
				[]int{1, 1},
			},
			[]int{1, 1},
		},
		{
			"two elements reverse order",
			args{
				[]int{2, 1},
			},
			[]int{1, 2},
		},
		{
			"three elements reverse order",
			args{
				[]int{3, 2, 1},
			},
			[]int{1, 2, 3},
		},
		{
			"mixed order with duplicates",
			args{
				[]int{3, 2, 1, 4, 1},
			},
			[]int{1, 1, 2, 3, 4},
		},
		{
			"already sorted",
			args{
				[]int{1, 2, 3, 4, 5},
			},
			[]int{1, 2, 3, 4, 5},
		},
		{
			"reverse sorted",
			args{
				[]int{5, 4, 3, 2, 1},
			},
			[]int{1, 2, 3, 4, 5},
		},
		{
			"large array with mixed values",
			args{
				[]int{64, 34, 25, 12, 22, 11, 90, 5, 77, 30},
			},
			[]int{5, 11, 12, 22, 25, 30, 34, 64, 77, 90},
		},
		{
			"array with negative numbers",
			args{
				[]int{-5, 3, -2, 8, -1, 0},
			},
			[]int{-5, -2, -1, 0, 3, 8},
		},
		{
			"array with all same elements",
			args{
				[]int{5, 5, 5, 5, 5},
			},
			[]int{5, 5, 5, 5, 5},
		},
		{
			"two elements already sorted",
			args{
				[]int{1, 2},
			},
			[]int{1, 2},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := mergeSort(tt.args.arr); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("mergeSort() = %v, want %v", got, tt.want)
			}
		})
	}
}
