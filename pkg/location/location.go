package location

import (
	"bytes"
	"encoding/xml"
	"io"
	"rpg-engine/pkg/location/item"
)

type Location struct {
	Items []item.LocationItem
}

func New(data []byte) (*Location, error) {
	loc := &Location{}
	decoder := xml.NewDecoder(bytes.NewReader(data))

	token, err := decoder.Token()
	for err != io.EOF {
		if err != nil {
			return nil, err
		}
		switch t := token.(type) {
		case xml.StartElement:
			if t.Name.Local == "location" {
				break
			}
			locItem := item.New(t)
			loc.Items = append(loc.Items, *locItem)
		}
		token, err = decoder.Token()
	}
	return loc, nil
}
