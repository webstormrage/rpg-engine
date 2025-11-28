package store

import (
	"fmt"
	"gorm.io/gorm"
)

type Store struct {
	DB *gorm.DB
}

func New(dialector gorm.Dialector, sqlScript string) (*Store, error) {
	db, err := gorm.Open(dialector, &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("не удалось подключиться к базе данных: %w", err)
	}

	err = db.Exec(sqlScript).Error
	if err != nil {
		return nil, fmt.Errorf("ошибка при выполнении миграционного скрипта: %w", err)
	}

	s := &Store{DB: db}

	user, err := s.GetUser("root")

	if err != nil {
		return nil, err
	}
	if user == nil {
		user, err = s.CreateUser("root")
	}

	campaign, err := s.GetCampaign("default")

	if err != nil {
		return nil, err
	}
	if campaign == nil {
		campaign, err = s.CreateCampaign("default")
	}

	session, err := s.GetSession("default")
	if err != nil {
		return nil, err
	}
	if session == nil {
		session, err = s.CreateSession("default", campaign.ID)
	}
	return s, nil
}
