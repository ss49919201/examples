package main

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/ss49919201/examples/go/gin/handler"
)

func defineRoutes(r *gin.Engine) {
	// r.Use(timeout.New(timeout.WithTimeout(time.Second)))
	r.GET("health", func(ctx *gin.Context) {
		// ctx.JSON(http.StatusOK, map[string]string{
		// 	"msg": "ok",
		// })
		ctx.String(http.StatusInternalServerError, "error")
	})
	r.POST("users/:user_id/entries", handler.CreateEntry)
}

func main() {
	r := gin.Default()

	defineRoutes(r)

	s := &http.Server{
		Addr:         ":8080",
		Handler:      r,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}
	s.ListenAndServe()
}
