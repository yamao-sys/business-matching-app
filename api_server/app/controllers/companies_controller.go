package controllers

import (
	"app/generated/companies"
	"app/services"
	"context"
	"log"
	"net/http"

	validation "github.com/go-ozzo/ozzo-validation/v4"
)

type CompaniesController interface {
	PostAuthSignIn(ctx context.Context, request companies.PostAuthSignInRequestObject) (companies.PostAuthSignInResponseObject, error)
	PostAuthValidateSignUp(ctx context.Context, request companies.PostAuthValidateSignUpRequestObject) (companies.PostAuthValidateSignUpResponseObject, error)
	PostAuthSignUp(ctx context.Context, request companies.PostAuthSignUpRequestObject) (companies.PostAuthSignUpResponseObject, error)
}

type companiesController struct {
	companyService services.CompanyService
}

func NewCompaniesController(companyService services.CompanyService) CompaniesController {
	return &companiesController{companyService}
}

func (cc *companiesController) PostAuthSignIn(ctx context.Context, request companies.PostAuthSignInRequestObject) (companies.PostAuthSignInResponseObject, error) {
	inputs := companies.CompanySignInInput{
		Email: request.Body.Email,
		Password: request.Body.Password,
	}

	statusCode, tokenString, err := cc.companyService.SignIn(ctx, inputs)
	switch (statusCode) {
	case http.StatusInternalServerError:
		return companies.PostAuthSignIn500JSONResponse{InternalServerErrorResponseJSONResponse: companies.InternalServerErrorResponseJSONResponse{
			Code: http.StatusInternalServerError,
			Message: err.Error(),
		}}, nil
	case http.StatusBadRequest:
		return companies.PostAuthSignIn400JSONResponse{CompanySignInBadRequestResponseJSONResponse: companies.CompanySignInBadRequestResponseJSONResponse{
			Errors: []string{err.Error()},
		}}, nil
	}
	
	// NOTE: Cookieにtokenをセット
	cookie := &http.Cookie{
		Name:     "token",
		Value:    tokenString,
		MaxAge:   3600 * 24,
		Path:     "/",
		Domain:   "localhost",
		Secure:   false,
		HttpOnly: true,
	}
	return companies.PostAuthSignIn200JSONResponse{CompanySignInOkResponseJSONResponse: companies.CompanySignInOkResponseJSONResponse{
		Headers: companies.CompanySignInOkResponseResponseHeaders{
			SetCookie: cookie.String(),
		},
	}}, nil
}

func (cc *companiesController) PostAuthValidateSignUp(ctx context.Context, request companies.PostAuthValidateSignUpRequestObject) (companies.PostAuthValidateSignUpResponseObject, error) {
	inputs := companies.CompanySignUpInput{
		Name: request.Body.Name,
		Tel: request.Body.Tel,
		Email: request.Body.Email,
		Password: request.Body.Password,
	}
	err := cc.companyService.ValidateSignUp(ctx, &inputs)
	validationError := cc.mappingValidationErrorStruct(err)

	res := &companies.CompanySignUpResponse{
		Code: http.StatusOK,
		Errors: validationError,
	}
	return companies.PostAuthValidateSignUp200JSONResponse{CompanySignUpResponseJSONResponse: companies.CompanySignUpResponseJSONResponse{Code: res.Code, Errors: res.Errors}}, nil
}

func (cc *companiesController) PostAuthSignUp(ctx context.Context, request companies.PostAuthSignUpRequestObject) (companies.PostAuthSignUpResponseObject, error) {
	inputs := companies.CompanySignUpInput{
		Name: request.Body.Name,
		Tel: request.Body.Tel,
		Email: request.Body.Email,
		Password: request.Body.Password,
	}
	err := cc.companyService.ValidateSignUp(ctx, &inputs)
	if err != nil {
		validationError := cc.mappingValidationErrorStruct(err)
	
		res := &companies.CompanySignUpResponse{
			Code: http.StatusBadRequest,
			Errors: validationError,
		}
		return companies.PostAuthSignUp400JSONResponse{Code: res.Code, Errors: res.Errors}, nil
	}

	signUpErr := cc.companyService.SignUp(ctx, inputs)
	if signUpErr != nil {
		log.Fatalln(err)
	}

	res := &companies.CompanySignUpResponse{
		Code: http.StatusOK,
		Errors: companies.CompanySignUpValidationError{},
	}
	return companies.PostAuthSignUp200JSONResponse{CompanySignUpResponseJSONResponse: companies.CompanySignUpResponseJSONResponse{Code: res.Code, Errors: res.Errors}}, nil
}

func (cc *companiesController) mappingValidationErrorStruct(err error) companies.CompanySignUpValidationError {
	var validationError companies.CompanySignUpValidationError
	if err == nil {
		return validationError
	}

	if errors, ok := err.(validation.Errors); ok {
		// NOTE: レスポンス用の構造体にマッピング
		for field, err := range errors {
			messages := []string{err.Error()}
			switch field {
			case "name":
				validationError.Name = &messages
			case "tel":
				validationError.Tel = &messages
			case "email":
				validationError.Email = &messages
			case "password":
				validationError.Password = &messages
			}
		}
	}
	return validationError
}
