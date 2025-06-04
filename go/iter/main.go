package main

import (
	"errors"
	"iter"
	"slices"
)

func chunk(s []string) iter.Seq2[[]string, error] {
	return func(yield func([]string, error) bool) {
		for i := 0; i < len(s); i += 5 {
			end := min(i+5, len(s))
			chunk := s[i:end]
			var err error
			if slices.Contains(chunk, "ng") {
				err = errors.New("invalid item")
			}
			if !yield(chunk, err) {
				return
			}
		}
	}
}

func chunkAndMap(s []string) ([][]string, error) {
	var result [][]string
	for chunked, err := range chunk(s) {
		if err != nil {
			return nil, err
		}

		var items []string
		for _, item := range chunked {
			items = append(items, "ok:"+item)
		}

		result = append(result, items)
	}
	return result, nil
}
