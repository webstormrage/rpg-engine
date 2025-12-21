package locationMapper

import (
	"github.com/stretchr/testify/require"
	"rpg-engine/pkg/model"
	"slices"
	"testing"
)

func TestLocationMapper_MapLocationToEntries(t *testing.T) {
	street := model.Location{
		Name: "street-loc",
		Xml: `<location>
            <room x="0" y="0" width="10" depth="10" />
            <door x="9" y="5" width="1" depth="1" />
            <tavern-loc x="20" y="0" />
        </location>`,
	}
	tavern := model.Location{
		Name: "tavern-loc",
		Xml: `<location>
                  <room x="0" y="0" width="10" depth="10" marker="pastion"/>
                  <door x="5" y="0" width="1" depth="1" marker="pastion-door"/>
              </location>`,
	}
	locMapping := map[string]model.Location{
		"street-loc": street,
		"tavern-loc": tavern,
	}

	entities, err := MapLocationToEntities(&street, locMapping, 0, 0)
	require.NoError(t, err)

	// TODO: снепшот тест
	t.Run("Success_Door", func(t *testing.T) {
		index := slices.IndexFunc(entities, func(e model.Entity) bool {
			return e.Marker == "pastion-door"
		})
		require.NotEqual(t, -1, index)
		door := entities[index]
		require.Equal(t, model.Entity{
			Name:   "door",
			Marker: "pastion-door",
			X:      5,
			Y:      0,
			Width:  1,
			Depth:  1,
		}, door)
	})
}
