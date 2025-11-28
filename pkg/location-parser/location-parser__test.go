package locationParser

import (
	"github.com/stretchr/testify/require"
	"testing"
)

func TestNew__WithAsserts(t *testing.T) {
	r := require.New(t)

	const testXML = `
<location>
     <barrel x='2' y='1' />
     <room x='0' y='0' width='10' depth='5'/>
</location>
`

	loc, err := New([]byte(testXML))

	r.NoError(err, "New() вернула неожиданную ошибку")

	r.NotNil(loc, "New() вернула nil *Location")

	r.Len(loc.Items, 2, "Неверное количество элементов в loc.Items")

	item := loc.Items[0]

	r.Len(item.Attributes, 2, "Неверное количество атрибутов")

	r.Equal(item.Type, "barrel", "Неверное имя тега (Type)")

	r.Equal(item.Attributes["x"], "2", "Неверное значение атрибута 'x'")

	r.Equal(item.Attributes["y"], "1", "Неверное значение атрибута 'y'")

	item = loc.Items[1]

	r.Len(item.Attributes, 4, "Неверное количество атрибутов")

	r.Equal(item.Type, "room", "Неверное имя тега (Type)")

	r.Equal(item.Attributes["x"], "0", "Неверное значение атрибута 'x'")

	r.Equal(item.Attributes["y"], "0", "Неверное значение атрибута 'y'")

	r.Equal(item.Attributes["width"], "10", "Неверное значение атрибута 'width'")

	r.Equal(item.Attributes["depth"], "5", "Неверное значение атрибута 'depth'")
}
