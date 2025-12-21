package model

type Action struct {
	ID         uint    `gorm:"primaryKey"`
	Points     float64 `gorm:"not null;default:0.0"`
	Initiative float64 `gorm:"not null;default:0.0"`
	EntityID   uint    `gorm:"not null"`
	SessionID  uint    `gorm:"not null"`
}
