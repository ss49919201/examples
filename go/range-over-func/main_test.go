/*
```prompt
./go/range-over-func/main.goにて実装されているtype Tasksのメソッドのベンチマークを計測するテストを書いてください。
````
*/

package main

import (
	"testing"
)

// 様々なサイズのタスクリストを生成するヘルパー関数
func generateTasks(size int) Tasks {
	tasks := make(Tasks, size)
	statuses := []TaskStatus{Todo, InProgress, Done}

	for i := 0; i < size; i++ {
		tasks[i] = &Task{
			ID:     i + 1,
			Status: statuses[i%3], // 均等に分布させる
		}
	}

	return tasks
}

// FilterByStatusWithoutSeqメソッドのベンチマーク（小規模データ）
func BenchmarkFilterByStatusWithoutSeq_Small(b *testing.B) {
	tasks := generateTasks(100)

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		result := tasks.FilterByStatusWithoutSeq(Todo)
		_ = result // 結果を使用して最適化を防ぐ
	}
}

// FilterByStatusメソッドのベンチマーク（小規模データ）
func BenchmarkFilterByStatus_Small(b *testing.B) {
	tasks := generateTasks(100)

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		seq := tasks.FilterByStatus(Todo)
		// イテレータを消費する
		for _, task := range seq {
			_ = task
		}
	}
}

// FilterByStatusWithoutSeqメソッドのベンチマーク（中規模データ）
func BenchmarkFilterByStatusWithoutSeq_Medium(b *testing.B) {
	tasks := generateTasks(1000)

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		result := tasks.FilterByStatusWithoutSeq(Todo)
		_ = result
	}
}

// FilterByStatusメソッドのベンチマーク（中規模データ）
func BenchmarkFilterByStatus_Medium(b *testing.B) {
	tasks := generateTasks(1000)

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		seq := tasks.FilterByStatus(Todo)
		for _, task := range seq {
			_ = task
		}
	}
}

// FilterByStatusWithoutSeqメソッドのベンチマーク（大規模データ）
func BenchmarkFilterByStatusWithoutSeq_Large(b *testing.B) {
	tasks := generateTasks(10000)

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		result := tasks.FilterByStatusWithoutSeq(Todo)
		_ = result
	}
}

// FilterByStatusメソッドのベンチマーク（大規模データ）
func BenchmarkFilterByStatus_Large(b *testing.B) {
	tasks := generateTasks(10000)

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		seq := tasks.FilterByStatus(Todo)
		for _, task := range seq {
			_ = task
		}
	}
}
