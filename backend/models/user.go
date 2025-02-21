package models

import (
	"errors"
	"task-manager/db"
	"task-manager/utils"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username string `json:"username" binding:"required" gorm:"unique;not null"`
	Email    string `json:"email" binding:"required,email" gorm:"unique;not null"`
	Password string `json:"password" binding:"required,min=6" gorm:"not null"`
	Tasks    []Task `json:"tasks,omitempty" gorm:"foreignKey:AssignedToID"`
}

type SafeUser struct {
	ID       uint   `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Tasks    []Task `json:"tasks,omitempty"`
}

func (u *User) RegisterUser() (*SafeUser, error) {
	hashedPassword, err := utils.HashPassword(u.Password)
	if err != nil {
		return nil, err
	}
	u.Password = hashedPassword

	result := db.DB.Create(u)
	if result.Error != nil {
		return nil, result.Error
	}

	safeUser := &SafeUser{
		ID:        u.ID,
		Username:  u.Username,
		Email:     u.Email,
		Tasks:     u.Tasks,
	}
	return safeUser, nil
}

func GetUserByEmail(email string) (*User, error) {
	var user User
	result := db.DB.Where("email = ?", email).First(&user)
	if result.Error != nil {
		return nil, result.Error
	}
	return &user, nil
}

func GetUserByID(id uint) (*SafeUser, error) {
	var user User
	result := db.DB.Preload("Tasks").First(&user, id)
	if result.Error != nil {
		return nil, result.Error
	}
	safeUser := &SafeUser{
		ID:       user.ID,
		Username: user.Username,
		Email:    user.Email,
		Tasks:    user.Tasks,
	}
	return safeUser, nil
}

func AuthenticateUser(email, password string) (*User, error) {
	user, err := GetUserByEmail(email)
	if err != nil {
		return nil, errors.New("invalid email or password")
	}

	if !utils.CheckPasswordHash(password, user.Password) {
		return nil, errors.New("invalid email or password")
	}

	return user, nil
}

func GetAllUsers() ([]SafeUser, error) {
	var users []User
	result := db.DB.Find(&users)
	if result.Error != nil {
		return nil, result.Error
	}

	var safeUsers []SafeUser
	for _, user := range users {
		safeUser := SafeUser{
			ID:       user.ID,
			Username: user.Username,
			Email:    user.Email,
		}
		safeUsers = append(safeUsers, safeUser)
	}
	return safeUsers, nil
}
