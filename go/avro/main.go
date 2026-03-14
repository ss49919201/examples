package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"os"

	"github.com/linkedin/goavro/v2"
)

func main() {
	format := flag.String("format", "json", "出力フォーマット: json | pretty | raw")
	schemaFile := flag.String("schema", "", "スキーマファイル (OCF以外のバイナリに使用)")
	flag.Usage = func() {
		fmt.Fprintf(os.Stderr, "使い方: avro-cli [オプション] <avroファイル>\n\n")
		fmt.Fprintf(os.Stderr, "オプション:\n")
		flag.PrintDefaults()
	}
	flag.Parse()

	if flag.NArg() < 1 {
		flag.Usage()
		os.Exit(1)
	}

	filePath := flag.Arg(0)
	f, err := os.Open(filePath)
	if err != nil {
		fmt.Fprintf(os.Stderr, "ファイルを開けません: %v\n", err)
		os.Exit(1)
	}
	defer f.Close()

	// OCF (Object Container File) として読み込む
	ocfReader, err := goavro.NewOCFReader(f)
	if err != nil {
		// OCF でない場合はスキーマファイルが必要
		if *schemaFile == "" {
			fmt.Fprintf(os.Stderr, "OCF形式ではありません。--schema でスキーマファイルを指定してください。\nエラー: %v\n", err)
			os.Exit(1)
		}
		readWithSchema(filePath, *schemaFile, *format)
		return
	}

	// スキーマを表示
	fmt.Fprintf(os.Stderr, "# スキーマ:\n%s\n\n", prettyJSON(ocfReader.Codec().Schema()))

	count := 0
	for ocfReader.Scan() {
		datum, err := ocfReader.Read()
		if err != nil {
			fmt.Fprintf(os.Stderr, "読み込みエラー (レコード %d): %v\n", count, err)
			os.Exit(1)
		}
		printDatum(datum, *format)
		count++
	}

	if err := ocfReader.Err(); err != nil {
		fmt.Fprintf(os.Stderr, "エラー: %v\n", err)
		os.Exit(1)
	}

	fmt.Fprintf(os.Stderr, "\n# 合計: %d レコード\n", count)
}

func readWithSchema(filePath, schemaFile, format string) {
	schemaBytes, err := os.ReadFile(schemaFile)
	if err != nil {
		fmt.Fprintf(os.Stderr, "スキーマファイルを読めません: %v\n", err)
		os.Exit(1)
	}

	codec, err := goavro.NewCodec(string(schemaBytes))
	if err != nil {
		fmt.Fprintf(os.Stderr, "スキーマのパースエラー: %v\n", err)
		os.Exit(1)
	}

	data, err := os.ReadFile(filePath)
	if err != nil {
		fmt.Fprintf(os.Stderr, "ファイル読み込みエラー: %v\n", err)
		os.Exit(1)
	}

	count := 0
	for len(data) > 0 {
		datum, remaining, err := codec.NativeFromBinary(data)
		if err != nil {
			fmt.Fprintf(os.Stderr, "デコードエラー (レコード %d): %v\n", count, err)
			os.Exit(1)
		}
		printDatum(datum, format)
		data = remaining
		count++
	}

	fmt.Fprintf(os.Stderr, "\n# 合計: %d レコード\n", count)
}

func printDatum(datum any, format string) {
	switch format {
	case "pretty":
		b, _ := json.MarshalIndent(datum, "", "  ")
		fmt.Println(string(b))
	case "raw":
		fmt.Printf("%v\n", datum)
	default: // json
		b, _ := json.Marshal(datum)
		fmt.Println(string(b))
	}
}

func prettyJSON(s string) string {
	var v any
	if err := json.Unmarshal([]byte(s), &v); err != nil {
		return s
	}
	b, _ := json.MarshalIndent(v, "", "  ")
	return string(b)
}
