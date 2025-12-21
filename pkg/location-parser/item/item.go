package item

import (
	"encoding/xml"
	"fmt"
	"strconv"
)

type LocationItem struct {
	Type       string
	Attributes map[string]string
}

func New(t xml.StartElement) *LocationItem {
	itemType := t.Name.Local

	attrsMap := make(map[string]string, len(t.Attr))
	for _, attr := range t.Attr {
		attrsMap[attr.Name.Local] = attr.Value
	}

	return &LocationItem{
		Type:       itemType,
		Attributes: attrsMap,
	}
}

func (i LocationItem) GetInt(name string) (int, error) {
	raw, ok := i.Attributes[name]
	if !ok {
		return 0, fmt.Errorf("could not find %s in locationItem: %s", name, i.Type)
	}
	val, err := strconv.Atoi(raw)
	if err != nil {
		return 0, err
	}
	return val, nil
}

func (i LocationItem) GetString(name string) (string, error) {
	val, ok := i.Attributes[name]
	if !ok {
		return "", fmt.Errorf("could not find %s in locationItem: %s", name, i.Type)
	}
	return val, nil
}
