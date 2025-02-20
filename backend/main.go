package main

import (
	"task-manager/db"
	"task-manager/models"
	"task-manager/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	db.ConnectDB()
	db.DB.AutoMigrate(&models.User{}, &models.Task{})

	server := gin.Default()
	routes.RegisterRoutes(server)
	server.Run(":8080")
}