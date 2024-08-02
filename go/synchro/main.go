package main

import (
	"fmt"

	"github.com/Code-Hex/synchro"
	"github.com/Code-Hex/synchro/tz"
)

type JstUser struct {
	UserId    string
	CreatedOn synchro.Time[tz.AsiaTokyo]
}

type UtcUser struct {
	UserId    string
	CreatedOn synchro.Time[tz.UTC]
}

func main() {
	jst := JstUser{
		UserId:    "jst",
		CreatedOn: synchro.Now[tz.AsiaTokyo](),
	}
	utc := UtcUser{
		UserId:    "utc",
		CreatedOn: synchro.Now[tz.UTC](),
	}

	fmt.Printf("%+v\n", jst)
	fmt.Printf("%+v\n", utc)
}
