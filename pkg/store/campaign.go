package store

import (
	"errors"
	"fmt"
	"gorm.io/gorm"
)

type Campaign struct {
	ID   uint   `gorm:"primaryKey"`
	Name string `gorm:"not null;unique"`
}

func (s *Store) CreateCampaign(name string) (*Campaign, error) {
	newCampaign := &Campaign{
		Name: name,
	}

	result := s.DB.Create(newCampaign)

	if result.Error != nil {
		return nil, fmt.Errorf("ошибка при создании кампании: %w", result.Error)
	}

	return newCampaign, nil
}

func (s *Store) GetCampaign(name string) (*Campaign, error) {
	var campaign Campaign

	result := s.DB.Where("name = ?", name).First(&campaign)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, fmt.Errorf("ошибка при поиске кампании: %w", result.Error)
	}

	return &campaign, nil
}
