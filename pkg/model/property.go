package model

type Attribute struct {
	ID          uint   `gorm:"primaryKey"`
	Name        string `gorm:"not null"`
	IntValue    int
	StringValue string

	EntityID uint `gorm:"not null"`
}
