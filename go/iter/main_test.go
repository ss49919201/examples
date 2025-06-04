package main

import (
	"reflect"
	"testing"
)

func Test_chunkAndMap(t *testing.T) {
	type args struct {
		s []string
	}
	tests := []struct {
		name    string
		args    args
		want    [][]string
		wantErr bool
	}{
		{
			name: "empty slice",
			args: args{s: []string{}},
			want: nil,
			wantErr: false,
		},
		{
			name: "single chunk without ng",
			args: args{s: []string{"a", "b", "c", "d", "e"}},
			want: [][]string{{"ok:a", "ok:b", "ok:c", "ok:d", "ok:e"}},
			wantErr: false,
		},
		{
			name: "single chunk with ng",
			args: args{s: []string{"a", "b", "ng", "d", "e"}},
			want: nil,
			wantErr: true,
		},
		{
			name: "multiple chunks without ng",
			args: args{s: []string{"a", "b", "c", "d", "e", "f", "g", "h", "i", "j"}},
			want: [][]string{
				{"ok:a", "ok:b", "ok:c", "ok:d", "ok:e"},
				{"ok:f", "ok:g", "ok:h", "ok:i", "ok:j"},
			},
			wantErr: false,
		},
		{
			name: "multiple chunks with ng in first chunk",
			args: args{s: []string{"a", "ng", "c", "d", "e", "f", "g", "h", "i", "j"}},
			want: nil,
			wantErr: true,
		},
		{
			name: "multiple chunks with ng in second chunk",
			args: args{s: []string{"a", "b", "c", "d", "e", "f", "ng", "h", "i", "j"}},
			want: nil,
			wantErr: true,
		},
		{
			name: "less than chunk size",
			args: args{s: []string{"a", "b", "c"}},
			want: [][]string{{"ok:a", "ok:b", "ok:c"}},
			wantErr: false,
		},
		{
			name: "less than chunk size with ng",
			args: args{s: []string{"a", "ng", "c"}},
			want: nil,
			wantErr: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := chunkAndMap(tt.args.s)
			if (err != nil) != tt.wantErr {
				t.Errorf("chunkAndMap() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("chunkAndMap() = %v, want %v", got, tt.want)
			}
		})
	}
}
