package locationMapper

import (
	"rpg-engine/pkg/location-parser/item"
	"rpg-engine/pkg/model"
)

func GeneralMap(item item.LocationItem, dx int, dy int) (*model.Entity, error) {

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
		width = 1
	}
	depth, err := item.GetInt("depth")
	if err != nil {
		depth = 1
	}

	marker, err := item.GetString("marker")
	if err != nil {
		marker = ""
	}

	return &model.Entity{
		Name:   item.Type,
		X:      x,
		Y:      y,
		Width:  width,
		Depth:  depth,
		Marker: marker,
	}, nil
}
