//go:build ignore

package main

import (
	"os"

	"github.com/linkedin/goavro/v2"
)

func main() {
	schema := `{
		"type": "record",
		"name": "User",
		"fields": [
			{"name": "id",    "type": "int"},
			{"name": "name",  "type": "string"},
			{"name": "email", "type": ["null","string"], "default": null}
		]
	}`

	codec, _ := goavro.NewCodec(schema)

	f, _ := os.Create("test.avro")
	defer f.Close()

	w, _ := goavro.NewOCFWriter(goavro.OCFConfig{
		W:     f,
		Codec: codec,
	})

	records := []map[string]any{
		{"id": 1, "name": "Alice", "email": map[string]any{"string": "alice@example.com"}},
		{"id": 2, "name": "Bob",   "email": map[string]any{"null": nil}},
		{"id": 3, "name": "Carol", "email": map[string]any{"string": "carol@example.com"}},
	}

	for _, r := range records {
		w.Append([]any{r})
	}
}
