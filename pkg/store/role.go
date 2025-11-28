package store

type Role struct {
	ID   uint   `gorm:"primaryKey"`
	Name string `gorm:"not null;unique"`

	UserID    uint `gorm:"not null"`
	EntityID  *uint
	SessionID uint `gorm:"not null"`
}
