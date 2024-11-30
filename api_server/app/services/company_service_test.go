package services

import (
	"app/generated/companies"
	models "app/models/generated"
	"testing"

	validation "github.com/go-ozzo/ozzo-validation/v4"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"github.com/volatiletech/sqlboiler/v4/queries/qm"
)

type TestCompanyServiceSuite struct {
	WithDBSuite
}

var testCompanyService CompanyService

func (s *TestCompanyServiceSuite) SetupTest() {
	s.SetDBCon()

	testCompanyService = NewCompanyService(DBCon)
}

func (s *TestCompanyServiceSuite) TearDownTest() {
	s.CloseDB()
}

func (s *TestCompanyServiceSuite) TestValidateSignUp_SuccessRequiredFields() {
	requestParams := companies.CompanySignUpInput{
		Name: "name",
		Tel: "012-3456-789",
		Email: "test@example.com",
		Password: "Password",
	}

	result := testCompanyService.ValidateSignUp(ctx, &requestParams)

	assert.Nil(s.T(), result)
}

func (s *TestCompanyServiceSuite) TestValidateSignUp_ValidationErrorRequiredFields() {
	requestParams := companies.CompanySignUpInput{
		Name: "",
		Tel: "",
		Email: "",
		Password: "",
	}

	result := testCompanyService.ValidateSignUp(ctx, &requestParams)

	assert.NotNil(s.T(), result)
	if errors, ok := result.(validation.Errors); ok {
		for field, err := range errors {
			message := err.Error()
			switch field {
			case "name":
				assert.Equal(s.T(), "企業名は必須入力です。", message)
			case "tel":
				assert.Equal(s.T(), "電話番号は必須入力です。", message)
			case "email":
				assert.Equal(s.T(), "Emailは必須入力です。", message)
			case "password":
				assert.Equal(s.T(), "パスワードは必須入力です。", message)
			}
		}
	}
}

func (s *TestCompanyServiceSuite) TestSignUp_SuccessRequiredFields() {
	requestParams := companies.CompanySignUpInput{
		Name: "name",
		Tel: "012-3456-789",
		Email: "test@example.com",
		Password: "Password",
	}

	result := testCompanyService.SignUp(ctx, requestParams)

	assert.Nil(s.T(), result)

	// NOTE: Companyが作成されていることを確認
	isExistsCompany, err := models.Companies(
		qm.Where("email = ?", "test@example.com"),
	).Exists(ctx, DBCon)
	if err != nil {
		s.T().Fatalf("failed to create company %v", err)
	}
	assert.True(s.T(), isExistsCompany)
}

// func (s *TestCompanyServiceSuite) TestSignIn() {
// 	// NOTE: テスト用ユーザの作成
// 	user := factories.UserFactory.MustCreateWithOption(map[string]interface{}{"Email": "test@example.com"}).(*models.User)
// 	if err := user.Insert(ctx, DBCon, boil.Infer()); err != nil {
// 		s.T().Fatalf("failed to create test user %v", err)
// 	}

// 	requestParams := dto.SignInRequest{Email: "test@example.com", Password: "password"}

// 	result := testCompanyService.SignIn(ctx, requestParams)

// 	assert.Nil(s.T(), result.Error)
// 	assert.Equal(s.T(), "", result.NotFoundMessage)
// 	assert.NotNil(s.T(), result.TokenString)
// }

// func (s *TestCompanyServiceSuite) TestSignIn_NotFoundError() {
// 	// NOTE: テスト用ユーザの作成
// 	user := factories.UserFactory.MustCreateWithOption(map[string]interface{}{"Email": "test@example.com"}).(*models.User)
// 	if err := user.Insert(ctx, DBCon, boil.Infer()); err != nil {
// 		s.T().Fatalf("failed to create test user %v", err)
// 	}

// 	requestParams := dto.SignInRequest{Email: "test_1@example.com", Password: "password"}

// 	result := testCompanyService.SignIn(ctx, requestParams)

// 	assert.Equal(s.T(), "メールアドレスまたはパスワードに該当するユーザが存在しません。", result.NotFoundMessage)
// }

func TestCompanyService(t *testing.T) {
	// テストスイートを実行
	suite.Run(t, new(TestCompanyServiceSuite))
}
