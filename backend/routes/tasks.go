package routes

import (
	"net/http"
	"strconv"
	"task-manager/models"

	"github.com/gin-gonic/gin"
)

func createTask(context *gin.Context) {
	_, exists := context.Get("userID")
	if !exists {
		context.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized."})
		return
	}

	var task models.Task

	if err := context.ShouldBindJSON(&task); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request data.", "error": err.Error()})
		return
	}

	newTask, err := task.CreateTask()
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not create task.", "error": err.Error()})
		return
	}

	context.JSON(http.StatusCreated, gin.H{"message": "Task created!", "task": newTask})
}

func getTask(context *gin.Context) {
	_, exists := context.Get("userID")
	if !exists {
		context.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized."})
		return
	}

	id, err := strconv.ParseUint(context.Param("id"), 10, 64)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": "Invalid task ID."})
		return
	}

	task, err := models.GetTask(uint(id))
	if err != nil {
		context.JSON(http.StatusNotFound, gin.H{"message": "Task not found.", "error": err.Error()})
		return
	}

	context.JSON(http.StatusOK, gin.H{"task": task})
}

func getAllTasks(context *gin.Context) {
	_, exists := context.Get("userID")
	if !exists {
		context.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized."})
		return
	}

	tasks, err := models.GetAllTasks()
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not fetch tasks.", "error": err.Error()})
		return
	}

	context.JSON(http.StatusOK, gin.H{"tasks": tasks})
}

func updateTask(context *gin.Context) {
	_, exists := context.Get("userID")
	if !exists {
		context.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized."})
		return
	}

	id, err := strconv.ParseUint(context.Param("id"), 10, 64)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": "Invalid task ID."})
		return
	}

	var updateData map[string]interface{}
	if err := context.ShouldBindJSON(&updateData); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request data.", "error": err.Error()})
		return
	}

	updatedTask, err := models.UpdateTask(uint(id), updateData)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not update task.", "error": err.Error()})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "Task updated!", "task": updatedTask})
}

func deleteTask(context *gin.Context) {
	_, exists := context.Get("userID")
	if !exists {
		context.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized."})
		return
	}
	
	id, err := strconv.ParseUint(context.Param("id"), 10, 64)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": "Invalid task ID."})
		return
	}

	err = models.DeleteTask(uint(id))
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not delete task.", "error": err.Error()})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "Task deleted successfully!"})
}
