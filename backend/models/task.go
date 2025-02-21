package models

import (
	"errors"
	"task-manager/db"
	"time"

	"gorm.io/gorm"
)

type Task struct {
	gorm.Model
	Title        string     `json:"title" binding:"required" gorm:"not null"`
	Description  string     `json:"description"`
	AssignedToID *uint      `json:"assigned_to_id,omitempty"`
	AssignedTo   *User      `json:"assigned_to,omitempty" gorm:"foreignKey:AssignedToID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	Status       string     `json:"status"`
	Priority     string     `json:"priority"`
	DueDate      *time.Time `json:"due_date"`
}

type SafeTask struct {
	ID           uint       `json:"id"`
	Title        string     `json:"title"`
	Description  string     `json:"description,omitempty"`
	AssignedToID *uint      `json:"assigned_to_id,omitempty"`
	AssignedTo   *SafeUser  `json:"assigned_to,omitempty"`
	Status       string     `json:"status"`
	Priority     string     `json:"priority"`
	DueDate      *time.Time `json:"due_date,omitempty"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
	DeletedAt    *time.Time `json:"deleted_at,omitempty"`
}

func (e *Task) CreateTask() (*SafeTask, error) {
	task := Task{
		Title:        e.Title,
		Description:  e.Description,
		AssignedToID: e.AssignedToID,
		Status:       e.Status,
		Priority:     e.Priority,
		DueDate:      e.DueDate,
	}

	result := db.DB.Create(&task)
	if result.Error != nil {
		return nil, result.Error
	}

	return task.ToSafeTask(), nil
}

func GetTask(id uint) (*SafeTask, error) {
	var task Task
	result := db.DB.Preload("AssignedTo").First(&task, id)
	if result.Error != nil {
		return nil, result.Error
	}

	return task.ToSafeTask(), nil
}

func GetAllTasks() ([]SafeTask, error) {
	var tasks []Task
	result := db.DB.Preload("AssignedTo").Find(&tasks)
	if result.Error != nil {
		return nil, result.Error
	}

	safeTasks := make([]SafeTask, len(tasks))
	for i, task := range tasks {
		safeTasks[i] = *task.ToSafeTask()
	}

	return safeTasks, nil
}

func UpdateTask(id uint, updatedData map[string]interface{}) (*SafeTask, error) {
	var existingTask Task

	if err := db.DB.First(&existingTask, id).Error; err != nil {
		return nil, err
	}

	if err := db.DB.Model(&existingTask).Updates(updatedData).Error; err != nil {
		return nil, err
	}

	if err := db.DB.Preload("AssignedTo").First(&existingTask, id).Error; err != nil {
		return nil, err
	}

	return existingTask.ToSafeTask(), nil
}

func DeleteTask(id uint) error {
	var task Task
	result := db.DB.First(&task, id)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return errors.New("task not found")
	}

	if err := db.DB.Delete(&task).Error; err != nil {
		return err
	}

	return nil
}

func (t *Task) ToSafeTask() *SafeTask {
	var safeUser *SafeUser
	if t.AssignedTo != nil {
		safeUser = &SafeUser{
			ID:       t.AssignedTo.ID,
			Username: t.AssignedTo.Username,
			Email:    t.AssignedTo.Email,
		}
	}

	return &SafeTask{
		ID:           t.ID,
		Title:        t.Title,
		Description:  t.Description,
		AssignedToID: t.AssignedToID,
		AssignedTo:   safeUser,
		Status:       t.Status,
		Priority:     t.Priority,
		DueDate:      t.DueDate,
		CreatedAt:    t.CreatedAt,
		UpdatedAt:    t.UpdatedAt,
	}
}