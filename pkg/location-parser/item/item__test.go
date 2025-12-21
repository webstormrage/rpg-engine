package item

import (
	"github.com/stretchr/testify/require"
	"testing"
)

func TestLocationItem_GetInt(t *testing.T) {
	testItem := LocationItem{
		Type: "wall",
		Attributes: map[string]string{
			"x":     "10",
			"y":     "20",
			"width": "1",
			"depth": "two",
		},
	}

	t.Run("Success_ValidInt", func(t *testing.T) {
		got, err := testItem.GetInt("x")

		require.NoError(t, err)
		require.Equal(t, 10, got)
	})

	t.Run("Error_NotFound", func(t *testing.T) {
		_, err := testItem.GetInt("missing_key")

		require.Error(t, err)
		require.Contains(t, err.Error(), "could not find missing_key in locationItem: wall")
	})

	t.Run("Error_InvalidFormat", func(t *testing.T) {
		_, err := testItem.GetInt("depth")

		require.Error(t, err)
		require.Contains(t, err.Error(), `strconv.Atoi: parsing "two"`)
	})
}

func TestLocationItem_GetString(t *testing.T) {
	// Подготовка данных для всех тестовых случаев
	testItem := LocationItem{
		Type: "barrel",
		Attributes: map[string]string{
			"x":      "10",
			"y":      "20",
			"marker": "beer barrel",
		},
	}

	t.Run("Success_PresentKey", func(t *testing.T) {
		got, err := testItem.GetString("marker")

		require.NoError(t, err)
		require.Equal(t, "beer barrel", got)
	})

	t.Run("Error_NotFound", func(t *testing.T) {
		_, err := testItem.GetString("another_missing_key")

		require.Error(t, err)
		require.Contains(t, err.Error(), "could not find another_missing_key in locationItem: barrel")
	})
}
