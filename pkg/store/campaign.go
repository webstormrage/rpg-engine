package store

import (
	"errors"
	"fmt"
	"gorm.io/gorm"
	"rpg-engine/pkg/model"
)

func (s *Store) CreateCampaign(name string) (*model.Campaign, error) {
	newCampaign := &model.Campaign{
		Name: name,
	}

	result := s.DB.Create(newCampaign)

	if result.Error != nil {
		return nil, fmt.Errorf("ошибка при создании кампании: %w", result.Error)
	}

	return newCampaign, nil
}

func (s *Store) GetCampaign(name string) (*model.Campaign, error) {
	var campaign model.Campaign

	result := s.DB.Where("name = ?", name).First(&campaign)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, fmt.Errorf("ошибка при поиске кампании: %w", result.Error)
	}

	return &campaign, nil
}
