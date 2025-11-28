package store

import (
	"errors"
	"fmt"
	"gorm.io/gorm"
)

type User struct {
	ID   uint   `gorm:"primaryKey"`
	Name string `gorm:"not null;unique"`
}

func (s *Store) CreateUser(name string) (*User, error) {
	newUser := &User{
		Name: name,
	}

	result := s.DB.Create(newUser)

	if result.Error != nil {
		return nil, fmt.Errorf("ошибка при создании пользователя: %w", result.Error)
	}

	return newUser, nil
}

func (s *Store) GetUser(name string) (*User, error) {
	var user User

	result := s.DB.Where("name = ?", name).First(&user)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, fmt.Errorf("ошибка при поиске пользователя: %w", result.Error)
	}

	return &user, nil
}
