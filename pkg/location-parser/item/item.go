package item

import "encoding/xml"

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
