package utils

import (
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

var jwtSecret = []byte(os.Getenv("JWT_SECRET"))

type Claims struct {
	UserID uint `json:"user_id"`
	UserEmail string `json:"user_email"`
	jwt.RegisteredClaims
}

func GenerateToken(userID uint, userEmail string) (string, error) {
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		UserID: userID,
		UserEmail: userEmail,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

func AuthMiddleware(context *gin.Context) {
	tokenString := context.GetHeader("Authorization")
	if tokenString == "" {
		return
	}

	if len(tokenString) < 8 || tokenString[:7] != "Bearer " {
		return
	}

	tokenString = tokenString[7:]
	claims := &Claims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})

	currentTime := time.Now()
	if claims.ExpiresAt.Time.Before(currentTime) {
		return
	}

	if err != nil {
		return
	}

	if !token.Valid {
		return
	}

	context.Set("userID", claims.UserID)
	context.Set("userEmail", claims.UserEmail)
	context.Next()
}