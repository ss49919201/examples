package main

import (
	"database/sql"
	"fmt"
	"os"

	"github.com/go-sql-driver/mysql"
	_ "github.com/go-sql-driver/mysql"
)

func newDBOrExit() *sql.DB {
	db, err := sql.Open("mysql", (&mysql.Config{
		User:                 "user",
		Passwd:               "password",
		Net:                  "tcp",
		Addr:                 "localhost:3306",
		DBName:               "rdb",
		ParseTime:            true,
		AllowNativePasswords: true,
	}).FormatDSN())
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
	return db
}

func main() {
	db := newDBOrExit()
	rows, err := db.Query("select * from users where id = ? lock in share mode", 1)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
	defer rows.Close()

	for rows.Next() {
		var id int
		var name string
		if err := rows.Scan(&id, &name); err != nil {
			fmt.Fprintln(os.Stderr, err)
			os.Exit(1)
		}
		fmt.Printf("id: %d, name: %s\n", id, name)
	}
	if err := rows.Err(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
