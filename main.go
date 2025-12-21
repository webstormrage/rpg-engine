package main

import (
	"log"
	"net/http"
)

func main() {
	// Папка со статикой
	fs := http.FileServer(http.Dir("./web/dist"))

	// Все запросы отдаём из папки web
	http.Handle("/", fs)

	addr := ":8080"
	log.Println("Server started at http://localhost" + addr)

	err := http.ListenAndServe(addr, nil)
	if err != nil {
		log.Fatal(err)
	}
}
