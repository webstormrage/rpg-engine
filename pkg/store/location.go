package store

type Location struct {
	ID   uint   `gorm:"primaryKey"`
	Name string `gorm:"not null;unique"`

	CampaignID uint `gorm:"not null"`
}
