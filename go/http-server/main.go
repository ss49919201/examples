package server

import (
	"context"
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"time"
)

type errorKey struct{}

func SetError(r *http.Request, err error) {
	*r = *r.WithContext(context.WithValue(r.Context(), errorKey{}, err))
}

func GetError(r *http.Request) (error, bool) {
	err, ok := r.Context().Value(errorKey{}).(error)
	return err, ok
}

func NewServer() *http.Server {
	return &http.Server{
		Addr:    ":8080",
		Handler: handler(),
	}
}

func handler() http.Handler {
	mux := http.NewServeMux()

	// routes
	mux.HandleFunc("POST /posts", func(w http.ResponseWriter, r *http.Request) {
		var body struct {
			Title string
			Body  string
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			err = fmt.Errorf("failed to decode request body: %w", err)
			SetError(r, err)
			return
		}

		out, err := createPost()
		if err != nil {
			SetError(r, err)
			return
		}

		w.WriteHeader(http.StatusCreated)
		w.Write([]byte(*out))
	})

	mux.HandleFunc("PUT /posts/{id}", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusNotImplemented)
	})

	// middleware
	var handler http.Handler = mux
	handler = recoverMiddleware(handler)
	handler = errorMiddleware(handler)
	handler = logMiddleware(handler)

	return handler
}

func logMiddleware(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		handler.ServeHTTP(w, r)
		end := time.Now()

		slog.Info(
			"received request",
			slog.String("method", r.Method),
			slog.String("url", r.URL.String()),
			slog.String("proto", r.Proto),
			slog.Duration("duration", end.Sub(start)),
		)
	})
}

func recoverMiddleware(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if r := recover(); r != nil {
				slog.Error("recovered from panic", slog.Any("error", r))
				w.WriteHeader(http.StatusInternalServerError)
			}
		}()
		handler.ServeHTTP(w, r)
	})
}

func errorMiddleware(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		handler.ServeHTTP(w, r)

		err, ok := GetError(r)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)

			if ok {
				slog.Error("error", slog.String("error", err.Error()))
			} else {
				slog.Error("error", slog.Any("unknown error", err))
			}

			w.Write([]byte("error occurred"))
		}
	})
}

func createPost() (*string, error) {
	return nil, nil
}
