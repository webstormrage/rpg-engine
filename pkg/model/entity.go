package model

type Entity struct {
	ID     uint   `gorm:"primaryKey"`
	Name   string `gorm:"not null"`
	X      float32
	Y      float32
	Width  float32 `gorm:"not null;default:1"` // 0-4
	Depth  float32 `gorm:"not null;default:1"` // 0-4
	Marker string  `gorm:"not null;default:''"`

	ParentEntityID uint
	ParentSlot     string
	SessionID      uint `gorm:"not null"`
}
