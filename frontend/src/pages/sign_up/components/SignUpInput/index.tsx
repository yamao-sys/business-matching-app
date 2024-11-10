import { FC, useCallback, useState } from 'react';
import { SignUpBaseLayout } from '../SignUpBaseLayout';
import {
  useSupporterSignUpSetStateContext,
  useSupporterSignUpStateContext,
} from '../../contexts/SupporterSignUpContext';
import { SupporterSignUpResponse } from '@/generated/auth/@types';
import { PhaseType } from '../../types';
import { SubmitButton } from '@/components/molucules/SubmitButton';
import { BoxInputForm } from '@/components/molucules/BoxInputForm';
import { ImageSelector } from '@/components/molucules/ImageSelector';

type Props = {
  togglePhase: (newPhase: PhaseType) => void;
};

const INITIAL_VALIDATION_ERRORS = {
  errors: {
    firstName: [],
    lastName: [],
    email: [],
    password: [],
    frontIdentification: [],
    backIdenfitication: [],
    skills: [],
  },
};

export const SignUpInput: FC<Props> = ({ togglePhase }: Props) => {
  const { supporterSignUpInput } = useSupporterSignUpStateContext();
  const { updateSignUpInput } = useSupporterSignUpSetStateContext();
  console.log(supporterSignUpInput);

  const [validationErrors, setValidationErrors] =
    useState<Pick<SupporterSignUpResponse, 'errors'>>(INITIAL_VALIDATION_ERRORS);

  const handleMoveToConfirm = useCallback(() => togglePhase('confirmation'), [togglePhase]);

  const setSupporterSignUpTextInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateSignUpInput({ [e.target.name]: e.target.value });
    },
    [updateSignUpInput],
  );

  const setSupporterSignUpFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, file: File) => {
      updateSignUpInput({ [e.target.name]: file });
    },
    [updateSignUpInput],
  );

  const clearSupporterSignUpFileInput = useCallback(
    (key: string) => {
      updateSignUpInput({ [key]: undefined });
    },
    [updateSignUpInput],
  );

  const handleValidateSignUp = useCallback(async () => {
    setValidationErrors(INITIAL_VALIDATION_ERRORS);
    handleMoveToConfirm();

    // try {
    //   const response = await postValidateSignUp(signUpInput);

    //   // バリデーションエラーがなければ、確認画面へ遷移
    //   if (Object.keys(response.errors).length === 0) {
    //     handleMoveToConfirm();
    //     return;
    //   }

    //   // NOTE: バリデーションエラーの格納と入力パスワードのリセット
    //   setValidationErrors(response);
    //   updateSignUpInput({ password: '', passwordConfirm: '' });
    // } catch (error) {
    //   // TODO: エラーハンドリング
    //   console.log(error);
    // }
  }, [setValidationErrors, handleMoveToConfirm]);

  return (
    <>
      <SignUpBaseLayout phase='form'>
        <BoxInputForm
          labelId='last-name'
          labelText='姓'
          name='lastName'
          value={supporterSignUpInput.lastName}
          onChange={setSupporterSignUpTextInput}
          validationErrorMessages={validationErrors.errors?.lastName ?? []}
          needsMargin={false}
        />

        <BoxInputForm
          labelId='first-name'
          labelText='名'
          name='firstName'
          value={supporterSignUpInput.firstName}
          onChange={setSupporterSignUpTextInput}
          validationErrorMessages={validationErrors.errors?.firstName ?? []}
          needsMargin={true}
        />

        <BoxInputForm
          labelId='email'
          labelText='Email'
          name='email'
          value={supporterSignUpInput.email}
          onChange={setSupporterSignUpTextInput}
          validationErrorMessages={validationErrors.errors?.email ?? []}
          needsMargin={true}
        />

        <BoxInputForm
          labelId='password'
          labelText='パスワード'
          name='password'
          value={supporterSignUpInput.password}
          onChange={setSupporterSignUpTextInput}
          validationErrorMessages={validationErrors.errors?.password ?? []}
          needsMargin={true}
        />

        <ImageSelector
          labelId='front-identication'
          name='frontIdentification'
          labelText='身分証明書(表)'
          onChange={setSupporterSignUpFileInput}
          onCancel={clearSupporterSignUpFileInput}
        />

        <ImageSelector
          labelId='back-identication'
          name='backIdentification'
          labelText='身分証明書(裏)'
          onChange={setSupporterSignUpFileInput}
          onCancel={clearSupporterSignUpFileInput}
        />

        <SubmitButton labelText='確認画面へ' color='green' onClick={handleValidateSignUp} />
      </SignUpBaseLayout>
    </>
  );
};
