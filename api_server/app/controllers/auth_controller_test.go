package controllers

import (
	"app/generated/auth"
	models "app/models/generated"
	"app/services"
	"bytes"
	"encoding/json"
	"mime/multipart"
	"net/http"
	"strconv"
	"testing"

	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"github.com/volatiletech/sqlboiler/v4/queries/qm"

	"github.com/oapi-codegen/testutil"
)

var (
	testAuthController AuthController
)

type TestAuthControllerSuite struct {
	WithDBSuite
}

func (s *TestAuthControllerSuite) SetupTest() {
	s.SetDBCon()

	authService := services.NewAuthService(DBCon)

	// NOTE: テスト対象のコントローラを設定
	testAuthController = NewAuthController(authService)
}

func (s *TestAuthControllerSuite) TearDownTest() {
	s.CloseDB()
}

func (s *TestAuthControllerSuite) TestPostAuthValidateSignUp_SuccessRequiredFields() {
	body := new(bytes.Buffer)
	// NOTE: フォームデータを作成する
	mw := multipart.NewWriter(body)

	w, _ := mw.CreateFormField("firstName")
	w.Write([]byte("first_name"))
	w2, _ := mw.CreateFormField("lastName")
	w2.Write([]byte("last_name"))
	w3, _ := mw.CreateFormField("email")
	w3.Write([]byte("test@example.com"))
	w4, _ := mw.CreateFormField("password")
	w4.Write([]byte("password"))

	// NOTE: 終了メッセージを書く
	mw.Close()

	e := echo.New()

	strictHandler := auth.NewStrictHandler(testAuthController, nil)
	auth.RegisterHandlers(e, strictHandler)

	result := testutil.NewRequest().Post("/auth/validateSignUp").WithBody(body.Bytes()).WithContentType(mw.FormDataContentType()).GoWithHTTPHandler(s.T(), e)
	assert.Equal(s.T(), http.StatusOK, result.Code())

	var res auth.SupporterSignUpResponseJSONResponse
	err := result.UnmarshalBodyToObject(&res)
	assert.NoError(s.T(), err, "error unmarshaling response")
	
	assert.Equal(s.T(), int64(http.StatusOK), res.Code)
	jsonErrors, _ := json.Marshal(res.Errors)
	assert.Equal(s.T(), "{}", string(jsonErrors))
}

func (s *TestAuthControllerSuite) TestPostAuthValidateSignUp_ValidationErrorRequiredFields() {
	body := new(bytes.Buffer)
	// NOTE: フォームデータを作成する
	mw := multipart.NewWriter(body)

	w, _ := mw.CreateFormField("firstName")
	w.Write([]byte(""))
	w2, _ := mw.CreateFormField("lastName")
	w2.Write([]byte(""))
	w3, _ := mw.CreateFormField("email")
	w3.Write([]byte(""))
	w4, _ := mw.CreateFormField("password")
	w4.Write([]byte(""))

	// NOTE: 終了メッセージを書く
	mw.Close()

	e := echo.New()

	strictHandler := auth.NewStrictHandler(testAuthController, nil)
	auth.RegisterHandlers(e, strictHandler)

	result := testutil.NewRequest().Post("/auth/validateSignUp").WithBody(body.Bytes()).WithContentType(mw.FormDataContentType()).GoWithHTTPHandler(s.T(), e)
	assert.Equal(s.T(), http.StatusOK, result.Code())

	var res auth.SupporterSignUpResponseJSONResponse
	err := result.UnmarshalBodyToObject(&res)
	assert.NoError(s.T(), err, "error unmarshaling response")
	
	assert.Equal(s.T(), int64(http.StatusOK), res.Code)
	assert.Equal(s.T(), &[]string{"名は必須入力です。"}, res.Errors.FirstName)
	assert.Equal(s.T(), &[]string{"姓は必須入力です。"}, res.Errors.LastName)
	assert.Equal(s.T(), &[]string{"Emailは必須入力です。"}, res.Errors.Email)
	assert.Equal(s.T(), &[]string{"パスワードは必須入力です。"}, res.Errors.Password)
}

func (s *TestAuthControllerSuite) TestPostAuthValidateSignUp_SuccessWithOptionalFields() {
	body := new(bytes.Buffer)
	// NOTE: フォームデータを作成する
	mw := multipart.NewWriter(body)

	w, _ := mw.CreateFormField("firstName")
	w.Write([]byte("first_name"))
	w2, _ := mw.CreateFormField("lastName")
	w2.Write([]byte("last_name"))
	w3, _ := mw.CreateFormField("email")
	w3.Write([]byte("test@example.com"))
	w4, _ := mw.CreateFormField("password")
	w4.Write([]byte("password"))

	pngSignature := []byte{0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A}
	jpgSignature := []byte{0xFF, 0xD8, 0xFF, 0xE0}
	// NOTE:データを格納
	var pngBuf, jpgBuf bytes.Buffer
	pngBuf.Write(pngSignature)
	jpgBuf.Write(jpgSignature)
	w5, _ := mw.CreateFormFile("frontIdentification", "frontIdentificationFile.png")
	w5.Write(pngBuf.Bytes())
	w6, _ := mw.CreateFormFile("backIdentification", "backIdentificationFile.jpg")
	w6.Write(jpgBuf.Bytes())

	// NOTE: 終了メッセージを書く
	mw.Close()

	e := echo.New()

	strictHandler := auth.NewStrictHandler(testAuthController, nil)
	auth.RegisterHandlers(e, strictHandler)

	result := testutil.NewRequest().Post("/auth/validateSignUp").WithBody(body.Bytes()).WithContentType(mw.FormDataContentType()).GoWithHTTPHandler(s.T(), e)
	assert.Equal(s.T(), http.StatusOK, result.Code())

	var res auth.SupporterSignUpResponseJSONResponse
	err := result.UnmarshalBodyToObject(&res)
	assert.NoError(s.T(), err, "error unmarshaling response")
	
	assert.Equal(s.T(), int64(http.StatusOK), res.Code)
	jsonErrors, _ := json.Marshal(res.Errors)
	assert.Equal(s.T(), "{}", string(jsonErrors))
}

func (s *TestAuthControllerSuite) TestPostAuthValidateSignUp_ValidationErrorWithOptionalFields() {
	body := new(bytes.Buffer)
	// NOTE: フォームデータを作成する
	mw := multipart.NewWriter(body)

	w, _ := mw.CreateFormField("firstName")
	w.Write([]byte("first_name"))
	w2, _ := mw.CreateFormField("lastName")
	w2.Write([]byte("last_name"))
	w3, _ := mw.CreateFormField("email")
	w3.Write([]byte("test@example.com"))
	w4, _ := mw.CreateFormField("password")
	w4.Write([]byte("password"))

	gifSignature := []byte{0x47, 0x49, 0x46, 0x38, 0x39, 0x61}
	// NOTE:データを格納
	var gifBuf bytes.Buffer
	gifBuf.Write(gifSignature)
	w5, _ := mw.CreateFormFile("frontIdentification", "frontIdentificationFile.gif")
	w5.Write(gifBuf.Bytes())
	w6, _ := mw.CreateFormFile("backIdentification", "backIdentificationFile.gif")
	w6.Write(gifBuf.Bytes())

	// NOTE: 終了メッセージを書く
	mw.Close()

	e := echo.New()

	strictHandler := auth.NewStrictHandler(testAuthController, nil)
	auth.RegisterHandlers(e, strictHandler)

	result := testutil.NewRequest().Post("/auth/validateSignUp").WithBody(body.Bytes()).WithContentType(mw.FormDataContentType()).GoWithHTTPHandler(s.T(), e)
	assert.Equal(s.T(), http.StatusOK, result.Code())

	var res auth.SupporterSignUpResponseJSONResponse
	err := result.UnmarshalBodyToObject(&res)
	assert.NoError(s.T(), err, "error unmarshaling response")
	
	assert.Equal(s.T(), int64(http.StatusOK), res.Code)
	assert.Equal(s.T(), &[]string{"身分証明書(表)の拡張子はwebp, png, jpegのいずれかでお願いします。"}, res.Errors.FrontIdentification)
	assert.Equal(s.T(), &[]string{"身分証明書(裏)の拡張子はwebp, png, jpegのいずれかでお願いします。"}, res.Errors.BackIdentification)
}

func (s *TestAuthControllerSuite) TestPostAuthSignUp_SuccessRequiredFields() {
	body := new(bytes.Buffer)
	// NOTE: フォームデータを作成する
	mw := multipart.NewWriter(body)

	w, _ := mw.CreateFormField("firstName")
	w.Write([]byte("first_name"))
	w2, _ := mw.CreateFormField("lastName")
	w2.Write([]byte("last_name"))
	w3, _ := mw.CreateFormField("email")
	w3.Write([]byte("test@example.com"))
	w4, _ := mw.CreateFormField("password")
	w4.Write([]byte("password"))

	// NOTE: 終了メッセージを書く
	mw.Close()

	e := echo.New()

	strictHandler := auth.NewStrictHandler(testAuthController, nil)
	auth.RegisterHandlers(e, strictHandler)

	result := testutil.NewRequest().Post("/auth/signUp").WithBody(body.Bytes()).WithContentType(mw.FormDataContentType()).GoWithHTTPHandler(s.T(), e)
	assert.Equal(s.T(), http.StatusOK, result.Code())

	var res auth.SupporterSignUpResponseJSONResponse
	err := result.UnmarshalBodyToObject(&res)
	assert.NoError(s.T(), err, "error unmarshaling response")
	
	assert.Equal(s.T(), int64(http.StatusOK), res.Code)
	jsonErrors, _ := json.Marshal(res.Errors)
	assert.Equal(s.T(), "{}", string(jsonErrors))

	// NOTE: Supporterが作成されていることを確認
	isExistSupporter, _ := models.Supporters(
		qm.Where("email = ?", "test@example.com"),
	).Exists(ctx, DBCon)
	assert.True(s.T(), isExistSupporter)
}

func (s *TestAuthControllerSuite) TestPostAuthSignUp_SuccessWithOptionalFields() {
	body := new(bytes.Buffer)
	// NOTE: フォームデータを作成する
	mw := multipart.NewWriter(body)

	w, _ := mw.CreateFormField("firstName")
	w.Write([]byte("first_name"))
	w2, _ := mw.CreateFormField("lastName")
	w2.Write([]byte("last_name"))
	w3, _ := mw.CreateFormField("email")
	w3.Write([]byte("test@example.com"))
	w4, _ := mw.CreateFormField("password")
	w4.Write([]byte("password"))

	pngSignature := []byte{0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A}
	jpgSignature := []byte{0xFF, 0xD8, 0xFF, 0xE0}
	// NOTE:データを格納
	var pngBuf, jpgBuf bytes.Buffer
	pngBuf.Write(pngSignature)
	jpgBuf.Write(jpgSignature)
	w5, _ := mw.CreateFormFile("frontIdentification", "frontIdentificationFile.png")
	w5.Write(pngBuf.Bytes())
	w6, _ := mw.CreateFormFile("backIdentification", "backIdentificationFile.jpg")
	w6.Write(jpgBuf.Bytes())

	// NOTE: 終了メッセージを書く
	mw.Close()

	e := echo.New()

	strictHandler := auth.NewStrictHandler(testAuthController, nil)
	auth.RegisterHandlers(e, strictHandler)

	result := testutil.NewRequest().Post("/auth/signUp").WithBody(body.Bytes()).WithContentType(mw.FormDataContentType()).GoWithHTTPHandler(s.T(), e)
	assert.Equal(s.T(), http.StatusOK, result.Code())

	var res auth.SupporterSignUpResponseJSONResponse
	err := result.UnmarshalBodyToObject(&res)
	assert.NoError(s.T(), err, "error unmarshaling response")
	
	assert.Equal(s.T(), int64(http.StatusOK), res.Code)
	jsonErrors, _ := json.Marshal(res.Errors)
	assert.Equal(s.T(), "{}", string(jsonErrors))

	// NOTE: Supporterが作成されていることを確認
	supporter, err := models.Supporters(
		qm.Where("email = ?", "test@example.com"),
	).One(ctx, DBCon)
	if err != nil {
		s.T().Fatalf("failed to create supporter %v", err)
	}
	id := strconv.Itoa(supporter.ID)
	assert.Equal(s.T(), "supporters/"+id+"/frontIdentificationFile.png", supporter.FrontIdentification)
	assert.Equal(s.T(), "supporters/"+id+"/backIdentificationFile.jpg", supporter.BackIdentification)
}

// func (s *TestAuthControllerSuite) TestSignIn() {
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
// 	testAuthController.SignIn(c)

// 	assert.Equal(s.T(), 200, res.Code)
// 	token = res.Result().Cookies()[0].Value
// 	assert.NotEmpty(s.T(), token)
// }

// func (s *TestAuthControllerSuite) TestSignIn_NotFoundError() {
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
// 	testAuthController.SignIn(c)

// 	assert.Equal(s.T(), 404, res.Code)
// 	assert.Empty(s.T(), res.Result().Cookies())
// }

func TestAuthController(t *testing.T) {
	// テストスイートを実施
	suite.Run(t, new(TestAuthControllerSuite))
}
