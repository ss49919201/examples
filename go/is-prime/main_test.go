package main

import "testing"

func Test_run(t *testing.T) {
	type args struct {
		n int
	}
	tests := []struct {
		name string
		args args
		want bool
	}{
		// true
		{"2", args{2}, true},
		{"3", args{3}, true},
		{"5", args{5}, true},
		{"7", args{7}, true},
		{"11", args{11}, true},
		{"13", args{13}, true},
		{"17", args{17}, true},
		{"19", args{19}, true},
		{"23", args{23}, true},
		{"29", args{29}, true},
		{"31", args{31}, true},
		{"37", args{37}, true},
		{"41", args{41}, true},
		{"43", args{43}, true},
		{"47", args{47}, true},
		{"53", args{53}, true},
		{"59", args{59}, true},
		{"61", args{61}, true},
		{"67", args{67}, true},
		{"71", args{71}, true},
		{"73", args{73}, true},
		{"79", args{79}, true},
		{"83", args{83}, true},
		{"89", args{89}, true},
		// false
		{"1", args{1}, false},
		{"3", args{1}, false},
		{"7", args{1}, false},
		{"13", args{1}, false},
		{"17", args{1}, false},
		{"19", args{1}, false},
		{"29", args{1}, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := run(tt.args.n); got != tt.want {
				t.Errorf("isPrime() = %v, want %v", got, tt.want)
			}
		})
	}
}
