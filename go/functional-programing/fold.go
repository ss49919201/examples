package main

func Fold[T any](cb func(initial T, x T) T, initial T, list []T) T {
	if len(list) == 0 {
		return initial
	}
	return Fold(cb, cb(initial, list[0]), list[1:])
}

func FoldR[T any](cb func(x T, initial T) T, initial T, list []T) T {
	if len(list) == 0 {
		return initial
	}
	return cb(list[0], FoldR(cb, initial, list[1:]))
}
