package store

type Turn struct {
	ID         uint    `gorm:"primaryKey"`
	Name       string  `gorm:"not null"`
	Remains    float64 `gorm:"not null;default:0.0"`
	Initiative float64 `gorm:"not null;default:0.0"`
	OutOfTurn  bool    `gorm:"not null;default:false"`
	Disabled   bool    `gorm:"not null;default:false"`

	EntityID  uint `gorm:"not null"`
	SessionID uint `gorm:"not null"`
}
