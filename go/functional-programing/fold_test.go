package main

import (
	"reflect"
	"testing"
)

func TestFold(t *testing.T) {
	type args struct {
		cb      func(initial int, x int) int
		initial int
		list    []int
	}
	tests := []struct {
		name string
		args args
		want int
	}{
		{
			"sum",
			args{
				func(initial int, x int) int {
					return initial + x
				},
				0,
				[]int{1, 2, 4},
			},
			7,
		},
		{
			"product",
			args{
				func(initial int, x int) int {
					return initial * x
				},
				1,
				[]int{1, 2, 4},
			},
			8,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := Fold(tt.args.cb, tt.args.initial, tt.args.list); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("Fold() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestFoldR(t *testing.T) {
	type args struct {
		cb      func(initial int, x int) int
		initial int
		list    []int
	}
	tests := []struct {
		name string
		args args
		want int
	}{
		{
			"sum",
			args{
				func(x int, initial int) int {
					return initial + x
				},
				0,
				[]int{1, 2, 4},
			},
			7,
		},
		{
			"product",
			args{
				func(x int, initial int) int {
					return initial * x
				},
				1,
				[]int{1, 2, 4},
			},
			8,
		},
		{
			"substruct",
			args{
				func(x int, initial int) int {
					return x - initial
				},
				1,
				[]int{1, 2, 4},
			},
			2,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := FoldR(tt.args.cb, tt.args.initial, tt.args.list); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("Fold() = %v, want %v", got, tt.want)
			}
		})
	}
}
