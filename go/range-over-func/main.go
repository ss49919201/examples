package main

import (
	"fmt"
	"iter"
)

type TaskStatus string

const (
	Todo       TaskStatus = "TODO"
	InProgress TaskStatus = "IN_PROGRESS"
	Done       TaskStatus = "DONE"
)

type Task struct {
	ID     int
	Status TaskStatus
}

type Tasks []*Task

func (t Tasks) FilterByStatusWithoutSeq(status TaskStatus) Tasks {
	var tasks Tasks
	for _, task := range t {
		if status == task.Status {
			tasks = append(tasks, task)
		}
	}
	return tasks
}

func (t Tasks) FilterByStatus(status TaskStatus) iter.Seq2[int, *Task] {
	return func(yield func(int, *Task) bool) {
		for i, task := range t {
			if status == task.Status {
				if !yield(i, task) {
					return
				}
			}
		}
	}
}

func main() {
	{
		tasks := Tasks([]*Task{
			{1, Todo},
			{2, Todo},
			{3, InProgress},
			{4, InProgress},
			{5, InProgress},
			{6, Done},
		})

		for _, task := range tasks.FilterByStatusWithoutSeq(Todo) {
			fmt.Println(task.ID)
		}
	}

	{
		tasks := Tasks([]*Task{
			{1, Todo},
			{2, Todo},
			{3, InProgress},
			{4, InProgress},
			{5, InProgress},
			{6, Done},
		})

		for _, task := range tasks.FilterByStatus(Todo) {
			fmt.Println(task.ID)
		}
	}
}
