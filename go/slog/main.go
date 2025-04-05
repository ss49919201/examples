package main

import (
	"context"
	"fmt"
	"log/slog"
	"os"
)

func main() {
	ex_customLogger()
}

func resetLogger() {
	slog.SetDefault(slog.Default())
}

func ex_SetDefault() {
	defer resetLogger()

	slog.SetDefault(
		slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
			AddSource: true,
		})),
	)

	slog.Info("info!")
	slog.Error("error!")
}

func ex_Group() {
	g := slog.Group("foo", toAnys([]string{"bar", "baz", "hoge", "fuga"})...)
	slog.Info("info!", g)
}

func toAnys[T any](s []T) []any {
	anys := make([]any, len(s))
	for i, v := range s {
		anys[i] = v
	}
	return anys
}

func ex_customLogger() {
	defer resetLogger()

	slog.SetDefault(
		slog.New(NewCustomLogger()),
	)

	slog.Info("info!")
	slog.Warn("warn!")
}

var _ slog.Handler = (*customLogger)(nil)

type customLogger struct {
	jsonHandler *slog.JSONHandler
}

func NewCustomLogger() *customLogger {
	return &customLogger{
		jsonHandler: slog.NewJSONHandler(os.Stdout, nil),
	}
}

func (c *customLogger) Enabled(ctx context.Context, l slog.Level) bool {
	return c.jsonHandler.Enabled(ctx, l)
}

func (c *customLogger) Handle(ctx context.Context, r slog.Record) error {
	if err := c.jsonHandler.Handle(ctx, r); err != nil {
		return err
	}

	if r.Level == slog.LevelWarn {
		fmt.Println("notify to external service")
	}

	return nil
}

func (c *customLogger) WithAttrs(attrs []slog.Attr) slog.Handler {
	return c.jsonHandler.WithAttrs(attrs)
}
func (c *customLogger) WithGroup(name string) slog.Handler {
	return c.jsonHandler.WithGroup(name)
}
