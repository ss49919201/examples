package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/ss49919201/examples/go/gin/usecase"
)

type createEntryURI struct {
	UserID int `json:"user_id" binding:"required"`
}

type createEntryBody struct {
	Title string `json:"title" binding:"required"`
	Body  string `json:"body" binding:"required"`
}

func CreateEntry(c *gin.Context) {
	var uri createEntryURI
	if err := c.ShouldBindUri(&uri); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	var body createEntryBody
	if err := c.ShouldBind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	execute := c.MustGet("CreateEntryUsecase").(usecase.CreateEntryUsecase)

	dto, err := execute(uri.UserID, body.Title, body.Body)
	if err != nil {
		_ = c.Error(err)
		c.Abort()
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"id":    dto.ID,
		"title": dto.Title,
		"body":  dto.Body,
	})
}
