import { FC, useCallback, useState } from 'react';
import { FormType, PhaseType } from '../../types';
import { SubmitButton } from '@/components/molucules/SubmitButton';
import { BoxInputForm } from '@/components/molucules/BoxInputForm';
import { FormTypeSelector } from '../FormTypeSelector';
import { components } from '@/generated/companies/apiSchema';
import {
  useCompanySignUpSetStateContext,
  useCompanySignUpStateContext,
} from '../../contexts/CompanySignUpContext';
import { postValidateCompanySignUp } from '@/apis/companiesApi';

type Props = {
  formType: FormType;
  switchFormType: (toFormType: FormType) => void;
  togglePhase: (newPhase: PhaseType) => void;
};

type CompanySignUpValidationError =
  components['responses']['CompanySignUpResponse']['content']['application/json']['errors'];

const INITIAL_VALIDATION_ERRORS = {
  name: [],
  tel: [],
  email: [],
  password: [],
};

export const CompanySignUpInput: FC<Props> = ({ formType, switchFormType, togglePhase }: Props) => {
  const { companySignUpInput } = useCompanySignUpStateContext();
  const { updateCompanySignUpInput } = useCompanySignUpSetStateContext();

  const [validationErrors, setValidationErrors] =
    useState<CompanySignUpValidationError>(INITIAL_VALIDATION_ERRORS);

  const handleMoveToConfirm = useCallback(() => togglePhase('confirmation'), [togglePhase]);

  const setCompanySignUpTextInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateCompanySignUpInput({ [e.target.name]: e.target.value });
    },
    [updateCompanySignUpInput],
  );

  const handleValidateSignUp = useCallback(async () => {
    setValidationErrors(INITIAL_VALIDATION_ERRORS);

    try {
      const response = await postValidateCompanySignUp(companySignUpInput);

      // バリデーションエラーがなければ、確認画面へ遷移
      if (Object.keys(response.errors).length === 0) {
        handleMoveToConfirm();
        return;
      }

      // NOTE: バリデーションエラーの格納と入力パスワードのリセット
      setValidationErrors(response.errors);
      updateCompanySignUpInput({ password: '' });
    } catch (error) {
      // TODO: エラーハンドリング
      console.log(error);
    }
  }, [setValidationErrors, handleMoveToConfirm, companySignUpInput, updateCompanySignUpInput]);

  return (
    <>
      <FormTypeSelector formType={formType} switchFormType={switchFormType} />

      <h3 className='mt-16 w-full text-center text-2xl font-bold'>企業登録フォーム</h3>

      <BoxInputForm
        labelId='name'
        labelText='企業名'
        name='name'
        value={companySignUpInput.name}
        onChange={setCompanySignUpTextInput}
        validationErrorMessages={validationErrors.name ?? []}
        needsMargin={true}
      />

      <BoxInputForm
        labelId='tel'
        labelText='電話番号'
        name='tel'
        placeholder='000-1111-222'
        value={companySignUpInput.tel}
        onChange={setCompanySignUpTextInput}
        validationErrorMessages={validationErrors.tel ?? []}
        needsMargin={true}
      />

      <BoxInputForm
        labelId='email'
        labelText='Email'
        name='email'
        value={companySignUpInput.email}
        onChange={setCompanySignUpTextInput}
        validationErrorMessages={validationErrors.email ?? []}
        needsMargin={true}
      />

      <BoxInputForm
        labelId='password'
        labelText='パスワード'
        name='password'
        value={companySignUpInput.password}
        onChange={setCompanySignUpTextInput}
        validationErrorMessages={validationErrors.password ?? []}
        needsMargin={true}
      />

      <SubmitButton labelText='確認画面へ' color='green' onClick={handleValidateSignUp} />
    </>
  );
};
