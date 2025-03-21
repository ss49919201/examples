package main

import (
	"github.com/gin-gonic/gin"
	"github.com/ss49919201/examples/go/gin/handler"
)

func defineRoutes(r *gin.Engine) {
	r.POST("users/:user_id/entries", handler.CreateEntry)
}

func main() {
	r := gin.Default()

	defineRoutes(r)

	r.Run()
}
