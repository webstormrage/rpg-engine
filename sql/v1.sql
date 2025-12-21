-- 1. Campaigns (Кампании)
CREATE TABLE IF NOT EXISTS campaigns (
                           id SERIAL,
                           name TEXT NOT NULL,

                           CONSTRAINT pk_campaigns PRIMARY KEY (id),
                           CONSTRAINT uq_campaigns_name UNIQUE (name)
);

-- 2. Users (Пользователи)
CREATE TABLE IF NOT EXISTS users (
                       id SERIAL,
                       name TEXT NOT NULL,

                       CONSTRAINT pk_users PRIMARY KEY (id),
                       CONSTRAINT uq_users_name UNIQUE (name)
);

-- 3. Sessions (Сессии) - зависит от campaigns
CREATE TABLE IF NOT EXISTS sessions (
                          id SERIAL,
                          time INTEGER NOT NULL DEFAULT 0,
                          name TEXT NOT NULL,
                          campaign_id INTEGER NOT NULL,

                          CONSTRAINT pk_sessions PRIMARY KEY (id),
                          CONSTRAINT uq_sessions_name UNIQUE (name),
                          CONSTRAINT fk_sessions_campaign_id FOREIGN KEY (campaign_id)
                              REFERENCES campaigns(id) ON DELETE CASCADE
);

-- 4. Locations (Локации) - зависит от campaigns
CREATE TABLE IF NOT EXISTS locations (
                           id SERIAL,
                           name TEXT NOT NULL,
                           campaign_id INTEGER NOT NULL,
                           xml TEXT NOT NULL,
                           is_entry BOOLEAN NOT NULL default FALSE,

                           CONSTRAINT pk_locations PRIMARY KEY (id),
                           CONSTRAINT uq_locations_name UNIQUE (name),
                           CONSTRAINT fk_locations_campaign_id FOREIGN KEY (campaign_id)
                               REFERENCES campaigns(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_one_entry_per_campaign
    ON locations (campaign_id)
    WHERE is_entry = TRUE;

-- 5. Entities (Сущности) - зависит от sessions, ссылается сама на себя
CREATE TABLE IF NOT EXISTS entities (
                          id SERIAL,
                          name TEXT NOT NULL,
                          x INTEGER NOT NULL,
                          y INTEGER NOT NULL,
                          width INTEGER NOT NULL DEFAULT 1,
                          depth INTEGER NOT NULL DEFAULT 1,
                          parent_entity_id INTEGER,
                          parent_slot TEXT,
                          session_id INTEGER NOT NULL,
                          marker TEXT NOT NULL DEFAULT '',
                          CONSTRAINT chk_max_dimensions CHECK (depth >= 1 AND depth <= 4 AND width >= 1 AND width <= 4),
                          CONSTRAINT pk_entities PRIMARY KEY (id),

    -- Внешний ключ на саму себя
                          CONSTRAINT fk_entities_parent_id FOREIGN KEY (parent_entity_id)
                              REFERENCES entities(id) ON DELETE SET NULL,

    -- Внешний ключ на сессию
                          CONSTRAINT fk_entities_session_id FOREIGN KEY (session_id)
                              REFERENCES sessions(id) ON DELETE CASCADE,

    -- ЗАЩИТА ОТ САМ СЕБЕ РОДИТЕЛЬ
    -- Проверяет, что ID не равен Parent ID.
    -- Если parent_entity_id IS NULL, условие возвращает NULL, что допустимо для CHECK.
                          CONSTRAINT chk_entities_no_self_parent CHECK (id <> parent_entity_id),

    -- Логика: Слот только внутри родителя
                          CONSTRAINT chk_entities_slot_requires_parent CHECK (
                              parent_slot IS NULL OR parent_entity_id IS NOT NULL
                              ),

    -- Уникальность слота внутри родителя
                          CONSTRAINT uq_entities_parent_slot UNIQUE (parent_entity_id, parent_slot)
);

-- 6. Roles (Роли) - зависит от users, entities, sessions
CREATE TABLE IF NOT EXISTS roles (
                       id SERIAL,
                       name TEXT NOT NULL,
                       user_id INTEGER NOT NULL,
                       entity_id INTEGER, -- nullable по схеме
                       session_id INTEGER NOT NULL,

                       CONSTRAINT pk_roles PRIMARY KEY (id),
                       CONSTRAINT uq_roles_name UNIQUE (name),

                       CONSTRAINT fk_roles_user_id FOREIGN KEY (user_id)
                           REFERENCES users(id) ON DELETE CASCADE,
                       CONSTRAINT fk_roles_entity_id FOREIGN KEY (entity_id)
                           REFERENCES entities(id) ON DELETE SET NULL,
                       CONSTRAINT fk_roles_session_id FOREIGN KEY (session_id)
                           REFERENCES sessions(id) ON DELETE CASCADE
);

-- 7. Attributes (Атрибуты) - зависит от entities
CREATE TABLE IF NOT EXISTS attributes (
                            id SERIAL,
                            name TEXT NOT NULL,
                            int_value INTEGER,
                            string_value TEXT,
                            entity_id INTEGER NOT NULL,

                            CONSTRAINT pk_attributes PRIMARY KEY (id),
                            CONSTRAINT fk_attributes_entity_id FOREIGN KEY (entity_id)
                                REFERENCES entities(id) ON DELETE CASCADE
);

-- 8. Turns (Ходы/Очередь) - зависит от entities, sessions
CREATE TABLE IF NOT EXISTS turns (
                       id SERIAL,
                       name TEXT NOT NULL,
                       remains DOUBLE PRECISION NOT NULL DEFAULT 0.0,
                       entity_id INTEGER NOT NULL,
                       initiative DOUBLE PRECISION NOT NULL DEFAULT 0.0,
                       out_of_turn BOOLEAN NOT NULL DEFAULT FALSE,
                       disabled BOOLEAN NOT NULL DEFAULT FALSE,
                       session_id INTEGER NOT NULL,

                       CONSTRAINT pk_turns PRIMARY KEY (id),

                       CONSTRAINT fk_turns_entity_id FOREIGN KEY (entity_id)
                           REFERENCES entities(id) ON DELETE CASCADE,
                       CONSTRAINT fk_turns_session_id FOREIGN KEY (session_id)
                           REFERENCES sessions(id) ON DELETE CASCADE
);