package validator

import (
	"app/generated/companies"
	"regexp"

	validation "github.com/go-ozzo/ozzo-validation/v4"
	"github.com/go-ozzo/ozzo-validation/v4/is"
)

func ValidateSignUpCompany(input *companies.CompanySignUpInput) error {
	return validation.ValidateStruct(input,
		validation.Field(
			&input.Name,
			validation.Required.Error("企業名は必須入力です。"),
			validation.RuneLength(1, 100).Error("名は1 ~ 100文字での入力をお願いします。"),
		),
		validation.Field(
			&input.Tel,
			validation.Required.Error("電話番号は必須入力です。"),
			validation.Match(regexp.MustCompile("^[0-9]{2,3}-[0-9]{4}-[0-9]{3,4}$")).Error("電話番号はxxx-yyyy-zzz形式での入力をお願いします。"),
		),
		validation.Field(
			&input.Email,
			validation.Required.Error("Emailは必須入力です。"),
			is.Email.Error("Emailの形式での入力をお願いします。"),
		),
		validation.Field(
			&input.Password,
			validation.Required.Error("パスワードは必須入力です。"),
			validation.Length(8, 24).Error("パスワードは8 ~ 24文字での入力をお願いします。"),
		),
	)
}
