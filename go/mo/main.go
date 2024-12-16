package main

import (
	"github.com/samber/mo"
)

func main() {
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
