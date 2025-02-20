package routes

import (
	"task-manager/utils"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(server *gin.Engine) {	
	server.POST("/auth/signup", registerUser)
	server.POST("/auth/login", loginUser)

	authenticated := server.Group("/api")

	authenticated.Use(utils.AuthMiddleware)

	authenticated.GET("/task/:id", getTask)
	authenticated.GET("/tasks", getAllTasks)
	authenticated.POST("/tasks", createTask)
	authenticated.PUT("/task/:id", updateTask)
	authenticated.DELETE("/task/:id", deleteTask)
	
	authenticated.GET("/user/:id", getUserProfile)
}