package main

import (
	"log/slog"
	"os"
	"time"

	slogmulti "github.com/samber/slog-multi"
	slogsampling "github.com/samber/slog-sampling"
)

func main() {
	option := slogsampling.AbsoluteSamplingOption{
		Tick: 5 * time.Second,
		Max:  10,

		Matcher: slogsampling.MatchAll(),
	}

	logger := slog.New(
		slogmulti.
			Pipe(option.NewMiddleware()).
			Handler(slog.NewJSONHandler(os.Stdout, nil)),
	)

	logger.Info("")
}
