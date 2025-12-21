package model

type Session struct {
	ID   uint   `gorm:"primaryKey"`
	Time int    `gorm:"not null;default:0"`
	Name string `gorm:"not null;unique"`

	CampaignID uint `gorm:"not null"`
}
