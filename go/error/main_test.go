package main

import (
	"errors"
	"fmt"
	"testing"
)

func Test_main(t *testing.T) {
	main()
}

func TestAsError(t *testing.T) {
	// E1エラーのテスト
	err1 := &E1{string: "test error"}

	// E1型として正常に変換できるかテスト
	ok, result := AsError[*E1](err1)
	if !ok {
		t.Errorf("Expected AsError to return true for E1 type")
	}
	if result == nil {
		t.Errorf("Expected AsError to return non-nil E1")
	}
	if result.Error() != "E1 error" {
		t.Errorf("Expected Error() to return 'E1 error', got %s", result.Error())
	}

	// ラップされたエラーのテスト
	wrappedErr := fmt.Errorf("wrapped: %w", err1)
	ok2, result2 := AsError[*E1](wrappedErr)
	if !ok2 {
		t.Errorf("Expected AsError to return true for wrapped E1 type")
	}
	if result2 == nil {
		t.Errorf("Expected AsError to return non-nil E1 for wrapped error")
	}

	// 異なる型のエラーのテスト
	differentErr := errors.New("different error")
	ok3, result3 := AsError[*E1](differentErr)
	if ok3 {
		t.Errorf("Expected AsError to return false for different error type")
	}
	if result3 != nil {
		t.Errorf("Expected AsError to return nil for different error type")
	}

	// nilエラーのテスト
	ok4, result4 := AsError[*E1](nil)
	if ok4 {
		t.Errorf("Expected AsError to return false for nil error")
	}
	if result4 != nil {
		t.Errorf("Expected AsError to return nil for nil error")
	}
}
