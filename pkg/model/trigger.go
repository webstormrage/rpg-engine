package model

type Trigger struct {
	ID        uint   `gorm:"primaryKey"`
	Name      string `gorm:"not null"`
	Triggered bool   `gorm:"default:false"`
	EntityID  uint   `gorm:"not null"`
	SessionID uint   `gorm:"not null"`
}
