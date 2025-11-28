package main

import (
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"log"
	"os"
	"rpg-engine/pkg/store"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatalf("Ошибка загрузки файла .env: %v", err)
	}

	// 2. Получение DSN и пути к миграции из переменных окружения
	dsn := os.Getenv("DATA_SOURCE_NAME")

	dialector := postgres.Open(dsn)

	if dsn == "" {
		log.Fatal("Переменная DATABASE_URL не найдена в .env")
	}

	migrationFile := "sql/v1.sql"

	sqlScript, err := os.ReadFile(migrationFile)
	if err != nil {
		panic(err)
	}

	// Используем вашу функцию New
	storage, err := store.New(dialector, sqlScript)
}
