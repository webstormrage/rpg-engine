package store

type Entity struct {
	ID     uint   `gorm:"primaryKey"`
	Name   string `gorm:"not null"`
	X      *int
	Y      *int
	Width  int `gorm:"not null;default:1"`
	Height int `gorm:"not null;default:1"`

	ParentEntityID *uint
	ParentSlot     *string
	SessionID      uint `gorm:"not null"`
}
