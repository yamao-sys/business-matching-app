package controllers

import (
	"app/generated/specialities"
	"context"
)

type SpecialitiesController interface {
	GetSpecialities(ctx context.Context, request specialities.GetSpecialitiesRequestObject) (specialities.GetSpecialitiesResponseObject, error)
}

type specialitiesController struct {}

func NewSpecialitiesController() SpecialitiesController {
	return &specialitiesController{}
}

func (sc *specialitiesController) GetSpecialities(ctx context.Context, request specialities.GetSpecialitiesRequestObject) (specialities.GetSpecialitiesResponseObject, error) {
	specialitiesMaster := []specialities.Speciality{
		specialities.Speciality{
			DisplayName: "PHP",
			Name: "PHP",
		},
		specialities.Speciality{
			DisplayName: "Ruby",
			Name: "Ruby",
		},
		specialities.Speciality{
			DisplayName: "Golang",
			Name: "Golang",
		},
	}

	res := specialities.GetSpecialities200JSONResponse{
		Specialities: specialitiesMaster,
	}
	return res, nil
}
