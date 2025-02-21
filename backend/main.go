package main

import (
	"task-manager/db"
	"task-manager/models"
	"task-manager/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	db.ConnectDB()
	db.DB.AutoMigrate(&models.User{}, &models.Task{})

	server := gin.Default()

	server.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:3000"},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders: []string{"*"},
	}))

	routes.RegisterRoutes(server)
	server.Run(":8080")
}