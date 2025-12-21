package model

type Location struct {
	ID      uint   `gorm:"primaryKey"`
	Name    string `gorm:"not null;unique"`
	Xml     string `gorm:"not null"`
	IsEntry bool   `gorm:"not null"`

	CampaignID uint `gorm:"not null"`
}
