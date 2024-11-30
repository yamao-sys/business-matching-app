package controllers

import (
	"app/generated/companies"
	models "app/models/generated"
	"app/services"
	"encoding/json"
	"net/http"
	"testing"

	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"github.com/volatiletech/sqlboiler/v4/queries/qm"

	"github.com/oapi-codegen/testutil"
)

var (
	testCompaniesController CompaniesController
)

type TestCompaniesControllerSuite struct {
	WithDBSuite
}

func (s *TestCompaniesControllerSuite) SetupTest() {
	s.SetDBCon()

	companyService := services.NewCompanyService(DBCon)

	// NOTE: テスト対象のコントローラを設定
	testCompaniesController = NewCompaniesController(companyService)
}

func (s *TestCompaniesControllerSuite) TearDownTest() {
	s.CloseDB()
}

func (s *TestCompaniesControllerSuite) TestPostAuthValidateSignUp_SuccessRequiredFields() {
	e := echo.New()

	strictHandler := companies.NewStrictHandler(testCompaniesController, nil)
	companies.RegisterHandlers(e, strictHandler)

	reqBody := companies.CompanySignUpInput{
		Name: "name",
		Tel: "012-3456-789",
		Email: "test@example.com",
		Password: "password",
	}
	result := testutil.NewRequest().Post("/companies/validateSignUp").WithJsonBody(reqBody).GoWithHTTPHandler(s.T(), e)
	assert.Equal(s.T(), http.StatusOK, result.Code())

	var res companies.CompanySignUpResponseJSONResponse
	err := result.UnmarshalBodyToObject(&res)
	assert.NoError(s.T(), err, "error unmarshaling response")
	
	assert.Equal(s.T(), int64(http.StatusOK), res.Code)
	jsonErrors, _ := json.Marshal(res.Errors)
	assert.Equal(s.T(), "{}", string(jsonErrors))
}

func (s *TestCompaniesControllerSuite) TestPostAuthValidateSignUp_ValidationErrorRequiredFields() {
	e := echo.New()

	strictHandler := companies.NewStrictHandler(testCompaniesController, nil)
	companies.RegisterHandlers(e, strictHandler)

	reqBody := companies.CompanySignUpInput{
		Name: "",
		Tel: "0123456789",
		Email: "",
		Password: "",
	}
	result := testutil.NewRequest().Post("/companies/validateSignUp").WithJsonBody(reqBody).GoWithHTTPHandler(s.T(), e)
	assert.Equal(s.T(), http.StatusOK, result.Code())

	var res companies.CompanySignUpResponseJSONResponse
	err := result.UnmarshalBodyToObject(&res)
	assert.NoError(s.T(), err, "error unmarshaling response")
	
	assert.Equal(s.T(), int64(http.StatusOK), res.Code)
	assert.Equal(s.T(), &[]string{"企業名は必須入力です。"}, res.Errors.Name)
	assert.Equal(s.T(), &[]string{"電話番号はxxx-yyyy-zzz形式での入力をお願いします。"}, res.Errors.Tel)
	assert.Equal(s.T(), &[]string{"Emailは必須入力です。"}, res.Errors.Email)
	assert.Equal(s.T(), &[]string{"パスワードは必須入力です。"}, res.Errors.Password)
}

func (s *TestCompaniesControllerSuite) TestPostAuthSignUp_SuccessRequiredFields() {
	e := echo.New()

	strictHandler := companies.NewStrictHandler(testCompaniesController, nil)
	companies.RegisterHandlers(e, strictHandler)

	reqBody := companies.CompanySignUpInput{
		Name: "name",
		Tel: "012-3456-789",
		Email: "test@example.com",
		Password: "password",
	}
	result := testutil.NewRequest().Post("/companies/signUp").WithJsonBody(reqBody).GoWithHTTPHandler(s.T(), e)
	assert.Equal(s.T(), http.StatusOK, result.Code())

	var res companies.CompanySignUpResponseJSONResponse
	err := result.UnmarshalBodyToObject(&res)
	assert.NoError(s.T(), err, "error unmarshaling response")
	
	assert.Equal(s.T(), int64(http.StatusOK), res.Code)
	jsonErrors, _ := json.Marshal(res.Errors)
	assert.Equal(s.T(), "{}", string(jsonErrors))

	// NOTE: Companyが作成されていることを確認
	isExistsCompany, err := models.Companies(
		qm.Where("email = ?", "test@example.com"),
	).Exists(ctx, DBCon)
	if err != nil {
		s.T().Fatalf("failed to create company %v", err)
	}
	assert.True(s.T(), isExistsCompany)
}

// func (s *TestCompaniesControllerSuite) TestSignIn() {
// 	// NOTE: テスト用ユーザの作成
// 	user := factories.UserFactory.MustCreateWithOption(map[string]interface{}{"Email": "test@example.com"}).(*models.User)
// 	if err := user.Insert(ctx, DBCon, boil.Infer()); err != nil {
// 		s.T().Fatalf("failed to create test user %v", err)
// 	}

// 	echoServer := echo.New()
// 	res := httptest.NewRecorder()
// 	signInRequestBody := bytes.NewBufferString("{\"email\":\"test@example.com\",\"password\":\"password\"}")
// 	req := httptest.NewRequest(http.MethodPost, "/auth/sign_in", signInRequestBody)
// 	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
// 	c := echoServer.NewContext(req, res)
// 	c.SetPath("auth/sign_in")
// 	testCompaniesController.SignIn(c)

// 	assert.Equal(s.T(), 200, res.Code)
// 	token = res.Result().Cookies()[0].Value
// 	assert.NotEmpty(s.T(), token)
// }

// func (s *TestCompaniesControllerSuite) TestSignIn_NotFoundError() {
// 	// NOTE: テスト用ユーザの作成
// 	user := factories.UserFactory.MustCreateWithOption(map[string]interface{}{"Email": "test@example.com"}).(*models.User)
// 	if err := user.Insert(ctx, DBCon, boil.Infer()); err != nil {
// 		s.T().Fatalf("failed to create test user %v", err)
// 	}

// 	echoServer := echo.New()
// 	res := httptest.NewRecorder()
// 	signInRequestBody := bytes.NewBufferString("{\"email\":\"test_1@example.com\",\"password\":\"password\"}")
// 	req := httptest.NewRequest(http.MethodPost, "/auth/sign_in", signInRequestBody)
// 	req.Header.Set(echo.HeaderContentType, "application/json")
// 	c := echoServer.NewContext(req, res)
// 	c.SetPath("auth/sing_in")
// 	testCompaniesController.SignIn(c)

// 	assert.Equal(s.T(), 404, res.Code)
// 	assert.Empty(s.T(), res.Result().Cookies())
// }

func TestCompaniesController(t *testing.T) {
	// テストスイートを実施
	suite.Run(t, new(TestCompaniesControllerSuite))
}