package store

import (
	gsqlite "github.com/glebarez/sqlite"
	"github.com/stretchr/testify/require"
	"testing"
)

const sqliteMigrationSQL = `
    -- Campaigns
    CREATE TABLE campaigns (id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE);
    -- Users
    CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE);
    -- Sessions
    CREATE TABLE sessions (
        id INTEGER PRIMARY KEY, 
        time INTEGER NOT NULL DEFAULT 0, 
        name TEXT NOT NULL UNIQUE, 
        campaign_id INTEGER NOT NULL,
        FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
    );
    -- Locations
    CREATE TABLE locations (
        id INTEGER PRIMARY KEY, 
        name TEXT NOT NULL UNIQUE,
        xml TEXT NOT NULL,
        is_entry BOOLEAN NOT NULL DEFAULT FALSE,
        campaign_id INTEGER NOT NULL,
        FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
    );
    -- Entities
    CREATE TABLE entities (
        id INTEGER PRIMARY KEY, 
        name TEXT NOT NULL, x INTEGER, y INTEGER, 
        width INTEGER NOT NULL DEFAULT 1, height INTEGER NOT NULL DEFAULT 1, 
        parent_entity_id INTEGER, parent_slot TEXT, session_id INTEGER NOT NULL,
        FOREIGN KEY (parent_entity_id) REFERENCES entities(id) ON DELETE SET NULL,
        FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
        UNIQUE (parent_entity_id, parent_slot)
        -- CHECK constraints omitted/ignored by SQLite
    );
    -- Roles
    CREATE TABLE roles (
        id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE, 
        user_id INTEGER NOT NULL, entity_id INTEGER, session_id INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE SET NULL,
        FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
    );
    -- Attributes
    CREATE TABLE attributes (
        id INTEGER PRIMARY KEY, name TEXT NOT NULL, 
        int_value INTEGER, string_value TEXT, entity_id INTEGER NOT NULL,
        FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE
    );
    -- Turns
    CREATE TABLE turns (
        id INTEGER PRIMARY KEY, name TEXT NOT NULL, 
        remains REAL NOT NULL DEFAULT 0.0, entity_id INTEGER NOT NULL,
        initiative REAL NOT NULL DEFAULT 0.0, out_of_turn BOOLEAN NOT NULL DEFAULT FALSE, 
        disabled BOOLEAN NOT NULL DEFAULT FALSE, session_id INTEGER NOT NULL,
        FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE,
        FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
    );
`

func TestNew_CreatesDefaultRecords(t *testing.T) {
	r := require.New(t)

	dialector := gsqlite.Open("file::memory:?cache=shared")

	s, err := New(dialector, sqliteMigrationSQL)

	r.NoError(err, "New() не должна возвращать ошибку при инициализации и миграции")
	r.NotNil(s, "Store не должен быть nil")
	r.NotNil(s.DB, "Внутреннее подключение GORM не должно быть nil")

	t.Run("Check Default User 'root'", func(t *testing.T) {
		user, err := s.GetUser("root")
		r.NoError(err)
		r.NotNil(user, "Дефолтный пользователь 'root' должен быть создан")
		r.Equal("root", user.Name)
	})
}
