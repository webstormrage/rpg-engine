package store

import (
	"errors"
	"fmt"
	"gorm.io/gorm"
)

type Session struct {
	ID   uint   `gorm:"primaryKey"`
	Time int    `gorm:"not null;default:0"`
	Name string `gorm:"not null;unique"`

	CampaignID uint `gorm:"not null"`
}

func (s *Store) CreateSession(name string, campaignID uint) (*Session, error) {
	newSession := &Session{
		Name:       name,
		CampaignID: campaignID, // Устанавливаем внешний ключ
	}

	result := s.DB.Create(newSession)

	if result.Error != nil {
		return nil, fmt.Errorf("ошибка при создании сессии: %w", result.Error)
	}

	return newSession, nil
}

func (s *Store) GetSession(name string) (*Session, error) {
	var session Session

	result := s.DB.Where("name = ?", name).First(&session)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, fmt.Errorf("ошибка при поиске сессии: %w", result.Error)
	}

	return &session, nil
}
