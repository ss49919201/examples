package main

import "testing"

func Test_binarySearch(t *testing.T) {
	type args struct {
		arr []int
		v   int
	}
	tests := []struct {
		name string
		args args
		want bool
	}{
		// Equivalence Partition 1: Empty array
		{
			"empty array",
			args{[]int{}, 1},
			false,
		},
		
		// Equivalence Partition 2: Single element - found
		{
			"single element - found",
			args{[]int{5}, 5},
			true,
		},
		
		// Equivalence Partition 3: Single element - not found
		{
			"single element - not found",
			args{[]int{5}, 3},
			false,
		},
		
		// Equivalence Partition 4: Multiple elements - found
		{
			"multiple elements - found",
			args{[]int{1, 3, 5, 7, 9}, 5},
			true,
		},
		
		// Equivalence Partition 5: Multiple elements - not found
		{
			"multiple elements - not found",
			args{[]int{1, 3, 5, 7, 9}, 4},
			false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := binarySearch(tt.args.arr, tt.args.v); got != tt.want {
				t.Errorf("binarySearch() = %v, want %v", got, tt.want)
			}
		})
	}
}
