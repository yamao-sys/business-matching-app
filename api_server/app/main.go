package main

import (
	"app/controllers"
	"app/db"
	"app/generated/auth"
	"app/generated/companies"
	"app/generated/specialities"
	"app/services"
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	dbCon := db.Init()

	// NOTE: service層のインスタンス化
	authService := services.NewAuthService(dbCon)
	companyService := services.NewCompanyService(dbCon)

	// NOTE: controllerをHandlerに追加
	server := controllers.NewAuthController(authService)
	strictHandler := auth.NewStrictHandler(server, nil)

	specialitiesServer := controllers.NewSpecialitiesController()
	specialitiesStrictHandler := specialities.NewStrictHandler(specialitiesServer, nil)

	companiesServer := controllers.NewCompaniesController(companyService)
	companiesStrictHandler := companies.NewStrictHandler(companiesServer, nil)

	// NOTE: Handlerをルーティングに追加
	e := echo.New()
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:5173"},
		AllowMethods: []string{http.MethodGet, http.MethodPut, http.MethodPost, http.MethodDelete},
	}))
	auth.RegisterHandlers(e, strictHandler)
	specialities.RegisterHandlers(e, specialitiesStrictHandler)
	companies.RegisterHandlers(e, companiesStrictHandler)

	e.Logger.Fatal(e.Start(":" + os.Getenv("SERVER_PORT")))
}
