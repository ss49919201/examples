package main

import (
	"context"
	"errors"
	"fmt"
	"log"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type User struct {
	ID     int
	Name   string
	Active bool
}

func main() {
	db, err := gorm.Open(mysql.Open("root:password@tcp(127.0.0.1:3306)/gorm_generics_example"))
	if err != nil {
		log.Fatal(err)
	}

	ctx := context.Background()

	users, err := gorm.G[User](db).Find(ctx)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(users)

	// 挿入
	result := gorm.WithResult()
	if err := gorm.G[User](db, result).Create(ctx, &User{
		Name:   "user_name_2",
		Active: false,
	}); err != nil {
		log.Fatal(err)
	}
	lastInsertId, err := result.Result.LastInsertId()
	if err != nil {
		log.Fatal(err)
	}

	// 単体取得
	user, err := gorm.G[User](db).
		Where("id = ?", lastInsertId).
		Take(ctx)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(user)

	// 更新
	if _, err := gorm.G[User](db, result).
		Where("id = ?", lastInsertId).
		Update(ctx, "name", "updated_user_name_2"); err != nil {
		log.Fatal(err)
	}

	// 削除
	if _, err := gorm.G[User](db, result).
		Where("id = ?", lastInsertId).
		Delete(ctx); err != nil {
		log.Fatal(err)
	}

	user, err = gorm.G[User](db).Where("id = ?", lastInsertId).Take(ctx)
	if err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			log.Fatal(err)
		}
	}
	fmt.Println(user)

	db.Model(User{})
}
