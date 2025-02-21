package routes

import (
	"net/http"
	"task-manager/models"
	"task-manager/utils"

	"github.com/gin-gonic/gin"
)

func registerUser(context *gin.Context) {
	var user models.User

	if err := context.ShouldBindJSON(&user); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request data.", "error": err.Error()})
		return
	}

	newUser, err := user.RegisterUser()
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not create user.", "error": err.Error()})
		return
	}

	token, err := utils.GenerateToken(newUser.ID, newUser.Email)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not generate token.", "error": err.Error()})
		return
	}

	context.JSON(http.StatusCreated, gin.H{"message": "User registered!", "user": newUser, "token": token})
}

func loginUser(context *gin.Context) {
	var credentials struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := context.ShouldBindJSON(&credentials); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request data."})
		return
	}

	user, err := models.AuthenticateUser(credentials.Email, credentials.Password)
	if err != nil {
		context.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid email or password."})
		return
	}

	token, err := utils.GenerateToken(user.ID, user.Email)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not generate token."})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "Login successful!", "token": token})
}

func getUserProfile(context *gin.Context) {
	userID, exists := context.Get("userID")
	if !exists {
		context.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized."})
		return
	}

	user, err := models.GetUserByID(userID.(uint))
	if err != nil {
		context.JSON(http.StatusNotFound, gin.H{"message": "User not found."})
		return
	}

	context.JSON(http.StatusOK, gin.H{"user": user})
}

func getAllUsers(context *gin.Context) {
	_, exists := context.Get("userID")
	if !exists {
		context.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized."})
		return
	}

	users, err := models.GetAllUsers()
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not fetch users."})
		return
	}

	context.JSON(http.StatusOK, gin.H{"users": users})
}
