package main

import (
	"io"
	"log"
	"net/http"
	"strings"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

var db *gorm.DB

type Scene struct {
	ID   uint   `gorm:"primaryKey"`
	Name string `gorm:"uniqueIndex"`
	Data []byte `gorm:"type:jsonb"`
}

func main() {
	var err error

	dsn := "host=localhost user=user password=password dbname=mydb port=5432 sslmode=disable"
	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}

	// миграция
	if err := db.AutoMigrate(&Scene{}); err != nil {
		log.Fatal(err)
	}

	// статика
	fs := http.FileServer(http.Dir("./web/dist"))
	http.Handle("/", fs)

	// API
	http.HandleFunc("/scene/", sceneHandler)

	addr := ":8080"
	log.Println("Server started at http://localhost" + addr)
	log.Fatal(http.ListenAndServe(addr, nil))
}

func sceneHandler(w http.ResponseWriter, r *http.Request) {
	name := strings.TrimPrefix(r.URL.Path, "/scene/")
	if name == "" {
		http.Error(w, "scene name required", http.StatusBadRequest)
		return
	}

	switch r.Method {
	case http.MethodPut:
		putScene(w, r, name)
	case http.MethodGet:
		getScene(w, r, name)
	default:
		w.Header().Set("Allow", "GET, PUT")
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}
}

func putScene(w http.ResponseWriter, r *http.Request, name string) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "failed to read body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	scene := Scene{
		Name: name,
		Data: body,
	}

	// UPSERT по name
	err = db.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "name"}},
		DoUpdates: clause.AssignmentColumns([]string{"data"}),
	}).Create(&scene).Error

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func getScene(w http.ResponseWriter, r *http.Request, name string) {
	var scene Scene

	err := db.Where("name = ?", name).First(&scene).Error
	if err == gorm.ErrRecordNotFound {
		http.Error(w, "scene not found", http.StatusNotFound)
		return
	}
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(scene.Data)
}
