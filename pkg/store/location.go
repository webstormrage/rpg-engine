package store

import (
	"errors"
	"rpg-engine/pkg/model"
)

func (s *Store) CreateLocation(name string, xml string, campaignId uint, isEntry bool) (model.Location, error) {
	location := model.Location{
		Name:       name,
		Xml:        xml,
		CampaignID: campaignId,
		IsEntry:    isEntry,
	}

	result := s.DB.Create(&location)

	if result.Error != nil {
		return model.Location{}, result.Error
	}

	return location, nil
}

func (s *Store) UpdateLocation(loc *model.Location) (model.Location, error) {
	if loc.ID == 0 {
		return model.Location{}, errors.New("location ID is required for update")
	}

	result := s.DB.Save(loc)

	if result.Error != nil {
		return model.Location{}, result.Error
	}

	return *loc, nil
}

func (s *Store) DeleteLocation(loc *model.Location) error {
	result := s.DB.Delete(loc)

	if result.Error != nil {
		return result.Error
	}

	return nil
}
