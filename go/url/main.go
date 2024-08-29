package main

import "net/url"

func main() {
	raw := "https://www.google.com?search=hello"
	parsed, _ := url.Parse(raw)

	query := parsed.Query()
	query.Add("search", "world")

	parsed.RawQuery = query.Encode()
}
