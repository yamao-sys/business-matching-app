package services

import (
	"app/generated/companies"
	models "app/models/generated"
	"app/validator"
	"context"
	"database/sql"
	"fmt"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/volatiletech/sqlboiler/v4/boil"
	"github.com/volatiletech/sqlboiler/v4/queries/qm"
	"golang.org/x/crypto/bcrypt"
)

type CompanyService interface {
	ValidateSignUp(ctx context.Context, request *companies.CompanySignUpInput) error
	SignUp(ctx context.Context, requestParams companies.CompanySignUpInput) error
	SignIn(ctx context.Context, requestParams companies.CompanySignInInput) (statusCode int64, tokenString string, error error)
	// GetAuthUser(ctx echo.Context) (*models.User, error)
	// Getuser(ctx context.Context, id int) *models.User
}

type companyService struct {
	db *sql.DB
}

func NewCompanyService(db *sql.DB) CompanyService {
	return &companyService{db}
}

func (cs *companyService) ValidateSignUp(ctx context.Context, request *companies.CompanySignUpInput) error {
	return validator.ValidateSignUpCompany(request)
}

func (cs *companyService) SignUp(ctx context.Context, requestParams companies.CompanySignUpInput) error {
	company := models.Company{}
	company.Name = requestParams.Name
	company.Tel = requestParams.Tel
	company.Email = requestParams.Email

	// NOTE: パスワードをハッシュ化の上、Create処理
	hashedPassword, err := cs.encryptPassword(requestParams.Password)
	if err != nil {
		return err
	}
	company.Password = hashedPassword
	createErr := company.Insert(ctx, cs.db, boil.Infer())
	if createErr != nil {
		return createErr
	}

	return nil
}

func (cs *companyService) SignIn(ctx context.Context, requestParams companies.CompanySignInInput) (statusCode int64, tokenString string, error error) {
	// NOTE: emailからCompanyの取得
	company, err := models.Companies(qm.Where("email = ?", requestParams.Email)).One(ctx, cs.db)
	if err != nil {
		return http.StatusBadRequest, "", fmt.Errorf("メールアドレスまたはパスワードに該当する%sが存在しません。", "企業")
	}

	// NOTE: パスワードの照合
	if err := cs.compareHashPassword(company.Password, requestParams.Password); err != nil {
		return http.StatusBadRequest, "", fmt.Errorf("メールアドレスまたはパスワードに該当する%sが存在しません。", "企業")
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": company.ID,
		"auth_type": "company",
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	})
	// TODO: JWT_SECRETを環境変数に切り出す
	tokenString, err = token.SignedString([]byte("abcdefghijklmn"))
	if err != nil {
		return http.StatusInternalServerError, "", err
	}
	return http.StatusOK, tokenString, nil
}

// // func (as *authService) GetAuthUser(ctx echo.Context) (*models.User, error) {
// // 	// NOTE: Cookieからtokenを取得
// // 	tokenString, err := ctx.Cookie("token")
// // 	if err != nil {
// // 		return &models.User{}, err
// // 	}
// // 	// NOTE: tokenに該当するユーザを取得する
// // 	token, err := jwt.Parse(tokenString.Value, func(token *jwt.Token) (interface{}, error) {
// // 		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
// // 			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
// // 		}

// // 		return []byte("abcdefghijklmn"), nil
// // 	})
// // 	if err != nil {
// // 		return &models.User{}, fmt.Errorf("failt jwt parse")
// // 	}

// // 	var userID int
// // 	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
// // 		userID = int(claims["user_id"].(float64))
// // 	}
// // 	if userID == 0 {
// // 		return &models.User{}, fmt.Errorf("invalid token")
// // 	}
// // 	user, err := models.FindUser(context.Background(), as.db, userID)
// // 	return user, err
// // }

// // func (as *authService) Getuser(ctx context.Context, id int) *models.User {
// // 	user, _ := models.FindUser(ctx, as.db, id)
// // 	return user
// // }

// NOTE: パスワードの文字列をハッシュ化する
func (cs *companyService) encryptPassword(password string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hash), nil
}

// NOTE: パスワードの照合
func (cs *companyService) compareHashPassword(hashedPassword, requestPassword string) error {
	if err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(requestPassword)); err != nil {
		return err
	}
	return nil
}
