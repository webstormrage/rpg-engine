package model

type Campaign struct {
	ID   uint   `gorm:"primaryKey"`
	Name string `gorm:"not null;unique"`
}
