package locationMapper

import (
	"rpg-engine/pkg/location-parser/item"
	"rpg-engine/pkg/model"
)

func MapRoom(item item.LocationItem, dx int, dy int) ([]model.Entity, error) {
	entities := []model.Entity{}

	x, err := item.GetInt("x")
	if err != nil {
		return nil, err
	}
	x += dx

	y, err := item.GetInt("y")
	if err != nil {
		return nil, err
	}
	y += dy

	width, err := item.GetInt("width")
	if err != nil {
		width = 3
	}
	depth, err := item.GetInt("depth")
	if err != nil {
		depth = 3
	}

	for i := x; i < x+width; i++ {
		var y1 = y
		var y2 = y + depth - 1
		e := model.Entity{
			Name:  "wall",
			X:     i,
			Y:     y1,
			Width: 1,
			Depth: 1,
		}
		entities = append(entities, e)
		e = model.Entity{
			Name:  "wall",
			X:     i,
			Y:     y2,
			Width: 1,
			Depth: 1,
		}
		entities = append(entities, e)
	}

	for j := y + 1; j < y+depth-1; j++ {
		var x1 = x
		var x2 = x + width - 1
		e := model.Entity{
			Name:  "wall",
			X:     x1,
			Y:     j,
			Width: 1,
			Depth: 1,
		}
		entities = append(entities, e)
		e = model.Entity{
			Name:  "wall",
			X:     x2,
			Y:     j,
			Width: 1,
			Depth: 1,
		}
		entities = append(entities, e)
	}
	return entities, nil
}
