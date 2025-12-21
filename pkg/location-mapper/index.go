package locationMapper

import (
	"fmt"
	locationParser "rpg-engine/pkg/location-parser"
	"rpg-engine/pkg/model"
)

func MapLocationToEntities(loc *model.Location, locMapping map[string]model.Location, x int, y int) ([]model.Entity, error) {
	entities := make([]model.Entity, 0)
	locParser, err := locationParser.New([]byte(loc.Xml))
	if err != nil {
		return nil, err
	}
	for _, item := range locParser.Items {
		switch item.Type {
		case "room":
			{
				nextEntities, err := MapRoom(item, x, y)
				if err != nil {
					return nil, err
				}
				entities = append(entities, nextEntities...)
			}
		case "door":
			fallthrough
		case "kip":
			fallthrough
		case "table":
			fallthrough
		case "furnace":
			fallthrough
		case "barrel":
			{
				entity, err := GeneralMap(item, x, y)
				if err != nil {
					return nil, err
				}
				entities = append(entities, *entity)
			}
		default:
			{
				nextLoc, ok := locMapping[item.Type]
				if !ok {
					return nil, fmt.Errorf("unknown location type: %s", item.Type)
				}

				nextX, err := item.GetInt("x")
				if err != nil {
					return nil, err
				}
				nextX += x

				nextY, err := item.GetInt("y")
				if err != nil {
					return nil, err
				}
				nextY += y

				nextEntities, err := MapLocationToEntities(&nextLoc, locMapping, nextX, nextY)
				if err != nil {
					return nil, err
				}
				entities = append(entities, nextEntities...)
			}
		}
	}
	return entities, nil
}
