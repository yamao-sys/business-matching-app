package services

import (
	"app/generated/auth"
	models "app/models/generated"
	"app/validator"
	"context"
	"database/sql"
	"io"
	"os"
	"strconv"

	"github.com/volatiletech/null/v8"
	"github.com/volatiletech/sqlboiler/v4/boil"
	"golang.org/x/crypto/bcrypt"

	"cloud.google.com/go/storage"
)

type AuthService interface {
	ValidateSignUp(ctx context.Context, request *auth.PostAuthValidateSignUpMultipartRequestBody) error
	SignUp(ctx context.Context, requestParams auth.PostAuthSignUpMultipartRequestBody) error
	// SignIn(ctx context.Context, requestParams dto.SignInRequest) *dto.SignInResponse
	// GetAuthUser(ctx echo.Context) (*models.User, error)
	// Getuser(ctx context.Context, id int) *models.User
}

type authService struct {
	db *sql.DB
}

func NewAuthService(db *sql.DB) AuthService {
	return &authService{db}
}

func (as *authService) ValidateSignUp(ctx context.Context, request *auth.PostAuthValidateSignUpMultipartRequestBody) error {
	return validator.ValidateSignUpSupporter(request)
}

func (as *authService) SignUp(ctx context.Context, requestParams auth.PostAuthSignUpMultipartRequestBody) error {
	supporter := models.Supporter{}
	supporter.FirstName = requestParams.FirstName
	supporter.LastName = requestParams.LastName
	supporter.Email = requestParams.Email
	if requestParams.Birthday != nil {
		supporter.Birthday = null.Time{Time: requestParams.Birthday.Time, Valid: true}
	}
	supporter.FrontIdentification = ""
	supporter.BackIdentification = ""

	// NOTE: パスワードをハッシュ化の上、Create処理
	hashedPassword, err := as.encryptPassword(requestParams.Password)
	if err != nil {
		return err
	}
	supporter.Password = hashedPassword
	createErr := supporter.Insert(ctx, as.db, boil.Infer())
	if createErr != nil {
		return createErr
	}

	client, err := storage.NewClient(ctx)
	if err != nil {
		return err
	}
	defer client.Close()

	if requestParams.FrontIdentification == nil && requestParams.BackIdentification == nil {
		return nil
	}

	supporter.Reload(ctx, as.db)
	supporterID := strconv.Itoa(supporter.ID)

	bucket := client.Bucket(os.Getenv("STORAGE_BUCKET_NAME"))

	if requestParams.FrontIdentification != nil {
		frontIdentificationPath := "supporters/"+supporterID+"/"+requestParams.FrontIdentification.Filename()
		reader, _ :=requestParams.FrontIdentification.Reader()
		uploadFrontIdentificationErr := as.uploadIdentification(bucket, frontIdentificationPath, reader)
		if uploadFrontIdentificationErr != nil {
			return uploadFrontIdentificationErr
		}
		supporter.FrontIdentification = frontIdentificationPath
	}
	if requestParams.BackIdentification != nil {
		backIdentificationPath := "supporters/"+supporterID+"/"+requestParams.BackIdentification.Filename()
		backIdentificationReader, _ :=requestParams.BackIdentification.Reader()
		uploadBackIdentificationErr := as.uploadIdentification(bucket, backIdentificationPath, backIdentificationReader)
		if uploadBackIdentificationErr != nil {
			return uploadBackIdentificationErr
		}
		supporter.BackIdentification = backIdentificationPath
	}
	_, updateIdenfiticationErr := supporter.Update(ctx, as.db, boil.Infer())
	return updateIdenfiticationErr
}

// // func (as *authService) SignIn(ctx context.Context, requestParams dto.SignInRequest) *dto.SignInResponse {
// // 	// NOTE: emailからユーザの取得
// // 	user, err := models.Users(qm.Where("email = ?", requestParams.Email)).One(ctx, as.db)
// // 	if err != nil {
// // 		return &dto.SignInResponse{TokenString: "", NotFoundMessage: "メールアドレスまたはパスワードに該当するユーザが存在しません。", Error: nil}
// // 	}

// // 	// NOTE: パスワードの照合
// // 	if err := as.compareHashPassword(user.Password, requestParams.Password); err != nil {
// // 		return &dto.SignInResponse{TokenString: "", NotFoundMessage: "メールアドレスまたはパスワードに該当するユーザが存在しません。", Error: nil}
// // 	}
// // 	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
// // 		"user_id": user.ID,
// // 		"exp":     time.Now().Add(time.Hour * 24).Unix(),
// // 	})
// // 	// TODO: JWT_SECRETを環境変数に切り出す
// // 	tokenString, err := token.SignedString([]byte("abcdefghijklmn"))
// // 	if err != nil {
// // 		return &dto.SignInResponse{TokenString: "", NotFoundMessage: "", Error: err}
// // 	}
// // 	return &dto.SignInResponse{TokenString: tokenString, NotFoundMessage: "", Error: nil}
// // }

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
func (as *authService) encryptPassword(password string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hash), nil
}

// // // NOTE: パスワードの照合
// // func (as *authService) compareHashPassword(hashedPassword, requestPassword string) error {
// // 	if err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(requestPassword)); err != nil {
// // 		return err
// // 	}
// // 	return nil
// // }

func (as *authService) uploadIdentification(bucket *storage.BucketHandle, path string, reader io.Reader) error {
	obj := bucket.Object(path)
	writer := obj.NewWriter(ctx)
	// NOTE: ファイルをCloud Storageにコピー
	if _, err := io.Copy(writer, reader); err != nil {
		return err
	}
	// NOTE: Writerを閉じて完了
	if err := writer.Close(); err != nil {
		return err
	}
	return nil
}
