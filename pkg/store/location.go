package store

import (
	"errors"
)

type Location struct {
	ID      uint   `gorm:"primaryKey"`
	Name    string `gorm:"not null;unique"`
	Xml     string `gorm:"not null"`
	IsEntry bool   `gorm:"not null"`

	CampaignID uint `gorm:"not null"`
}

func (s *Store) CreateLocation(name string, xml string, campaignId uint, isEntry bool) (Location, error) {
	location := Location{
		Name:       name,
		Xml:        xml,
		CampaignID: campaignId,
		IsEntry:    isEntry,
	}

	result := s.DB.Create(&location)

	if result.Error != nil {
		return Location{}, result.Error
	}

	return location, nil
}

func (s *Store) UpdateLocation(loc *Location) (Location, error) {
	if loc.ID == 0 {
		return Location{}, errors.New("location ID is required for update")
	}

	result := s.DB.Save(loc)

	if result.Error != nil {
		return Location{}, result.Error
	}

	return *loc, nil
}

func (s *Store) DeleteLocation(loc *Location) error {
	result := s.DB.Delete(loc)

	if result.Error != nil {
		return result.Error
	}

	return nil
}
