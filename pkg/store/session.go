package store

import (
	"errors"
	"fmt"
	"gorm.io/gorm"
	locationMapper "rpg-engine/pkg/location-mapper"
	"rpg-engine/pkg/model"
)

func (s *Store) CreateSession(name string, campaignID uint) (*model.Session, error) {
	err := s.DB.Transaction(func(tx *gorm.DB) error {
		newSession := &model.Session{
			Name:       name,
			CampaignID: campaignID, // Устанавливаем внешний ключ
		}

		sessionResult := s.DB.Create(newSession)

		if sessionResult.Error != nil {
			return fmt.Errorf("ошибка при создании сессии: %w", sessionResult.Error)
		}

		var entryLocation model.Location
		result := tx.Where("campaign_id = ? AND is_entry = TRUE", campaignID).First(&entryLocation)

		if result.Error != nil {
			return result.Error
		}

		var locations []model.Location
		result = tx.Where("campaign_id = ? AND is_entry", campaignID).Find(&locations)

		var locationMapping map[string]model.Location
		for _, location := range locations {
			locationMapping[location.Name] = location
		}

		entities, err := locationMapper.MapLocationToEntities(&entryLocation, locationMapping, 0, 0)
		for _, entity := range entities {
			result := tx.Create(&entity)
			if result.Error != nil {
				return result.Error
			}
		}
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

func (s *Store) GetSession(name string) (*model.Session, error) {
	var session model.Session

	result := s.DB.Where("name = ?", name).First(&session)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, fmt.Errorf("ошибка при поиске сессии: %w", result.Error)
	}

	return &session, nil
}
