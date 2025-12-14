package main

import (
	"fmt"
	"os"
	"strconv"

	"github.com/samber/mo"
	"github.com/samber/mo/result"
)

func appendDoubleZero(s string) string {
	return s + "00"
}

func main() {
	r := result.Pipe2(
		mo.Ok("1"),
		result.Map(appendDoubleZero),
		result.FlatMap(func(v string) mo.Result[int] {
			s, err := strconv.Atoi(v)
			if err != nil {
				return mo.Err[int](err)
			}
			return mo.Ok(s)
		}),
	)
	got, err := r.Get()
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	fmt.Println("result is:", got)
}

type addItemToCartCommandInput struct {
	itemID    int
	userToken string
}

func addItemToCartCommand() func(addItemToCartCommandInput) error {
	return func(in addItemToCartCommandInput) error {
		return nil
	}
}

type user struct {
	id int
}

func getUserByToken(token string) mo.Result[user] {
	_ = token

	return mo.Ok(user{
		id: 1,
	})
}

type cartItem struct {
	itemID int
}

type cart struct {
	id     int
	userID int
	items  []cartItem
}

func getCartByUserID(userID int) mo.Result[cart] {
	return mo.Ok(cart{
		id:     1,
		userID: userID,
		items:  []cartItem{},
	})
}

func saveCart(_ cart) mo.IO[error] {
	return mo.NewIO(func() error {
		return nil
	})
}
