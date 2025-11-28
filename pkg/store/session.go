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

func extractEntitiesFromLocation(tx *gorm.DB, loc *Location, dx int, dy int) error {
	// TODO: c помощью location parser заполнить таблицу entitities (X, Y, depth, width, session_id)
	// TODO: при нахождении нестандартного тега искать дочернюю
}

func (s *Store) CreateSession(name string, campaignID uint) (*Session, error) {
	err := s.DB.Transaction(func(tx *gorm.DB) error {
		newSession := &Session{
			Name:       name,
			CampaignID: campaignID, // Устанавливаем внешний ключ
		}

		sessionResult := s.DB.Create(newSession)

		if sessionResult.Error != nil {
			return fmt.Errorf("ошибка при создании сессии: %w", sessionResult.Error)
		}

		var location Location
		result := tx.Where("campaign_id = ? AND is_entry = TRUE", campaignID).First(&location)

		if result.Error != nil {
			return result.Error
		}
		err := extractEntitiesFromLocation(tx, &location, 0, 0)
		if err != nil {
			return err
		}

		return nil
	})
	if err != nil {
		return nil, err
	}
	session, err := s.GetSession(name)
	if err != nil {
		return nil, err
	}
	return session, nil
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
