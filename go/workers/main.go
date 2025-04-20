package main

import (
	"net/http"

	"github.com/syumai/workers"
)

func main() {
	http.HandleFunc("/hello", func(w http.ResponseWriter, req *http.Request) {
		w.Write([]byte("world"))
	})
	workers.Serve(nil) // if nil is given, http.DefaultServeMux is used.
}
