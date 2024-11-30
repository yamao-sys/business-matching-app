import { FC, useCallback, useState } from 'react';
import {
  useSupporterSignUpSetStateContext,
  useSupporterSignUpStateContext,
} from '../../contexts/SupporterSignUpContext';
import { FormType, PhaseType } from '../../types';
import { SubmitButton } from '@/components/molucules/SubmitButton';
import { BoxInputForm } from '@/components/molucules/BoxInputForm';
import { ImageSelector } from '@/components/molucules/ImageSelector';
import { postValidateSignUp } from '@/apis/authApi';
import { components } from '@/generated/auth/apiSchema';
import { BoxDatePicker } from '@/components/molucules/BoxDatePicker';
import { FormTypeSelector } from '../FormTypeSelector';

type Props = {
  formType: FormType;
  switchFormType: (toFormType: FormType) => void;
  togglePhase: (newPhase: PhaseType) => void;
};

type SupporterSignUpValidationError =
  components['responses']['SupporterSignUpResponse']['content']['application/json']['errors'];

const INITIAL_VALIDATION_ERRORS = {
  firstName: [],
  lastName: [],
  email: [],
  password: [],
  birthday: [],
  frontIdentification: [],
  backIdentification: [],
};

export const SupporterSignUpInput: FC<Props> = ({
  formType,
  switchFormType,
  togglePhase,
}: Props) => {
  const { supporterSignUpInput } = useSupporterSignUpStateContext();
  const { updateSignUpInput, clearIdentificationKey } = useSupporterSignUpSetStateContext();

  const [validationErrors, setValidationErrors] =
    useState<SupporterSignUpValidationError>(INITIAL_VALIDATION_ERRORS);

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
      if (key === 'frontIdentification' || key === 'backIdentification') {
        clearIdentificationKey(key);
      }
    },
    [clearIdentificationKey],
  );

  const handleValidateSignUp = useCallback(async () => {
    setValidationErrors(INITIAL_VALIDATION_ERRORS);

    try {
      const response = await postValidateSignUp(supporterSignUpInput);

      // バリデーションエラーがなければ、確認画面へ遷移
      if (Object.keys(response.errors).length === 0) {
        handleMoveToConfirm();
        return;
      }

      // NOTE: バリデーションエラーの格納と入力パスワードのリセット
      setValidationErrors(response.errors);
      updateSignUpInput({ password: '' });
    } catch (error) {
      // TODO: エラーハンドリング
      console.log(error);
    }
  }, [setValidationErrors, handleMoveToConfirm, supporterSignUpInput, updateSignUpInput]);

  return (
    <>
      <FormTypeSelector formType={formType} switchFormType={switchFormType} />

      <h3 className='mt-16 w-full text-center text-2xl font-bold'>エンジニア登録フォーム</h3>

      <BoxInputForm
        labelId='last-name'
        labelText='姓'
        name='lastName'
        value={supporterSignUpInput.lastName}
        onChange={setSupporterSignUpTextInput}
        validationErrorMessages={validationErrors.lastName ?? []}
        needsMargin={true}
      />

      <BoxInputForm
        labelId='first-name'
        labelText='名'
        name='firstName'
        value={supporterSignUpInput.firstName}
        onChange={setSupporterSignUpTextInput}
        validationErrorMessages={validationErrors.firstName ?? []}
        needsMargin={true}
      />

      <BoxInputForm
        labelId='email'
        labelText='Email'
        name='email'
        value={supporterSignUpInput.email}
        onChange={setSupporterSignUpTextInput}
        validationErrorMessages={validationErrors.email ?? []}
        needsMargin={true}
      />

      <BoxInputForm
        labelId='password'
        labelText='パスワード'
        name='password'
        value={supporterSignUpInput.password}
        onChange={setSupporterSignUpTextInput}
        validationErrorMessages={validationErrors.password ?? []}
        needsMargin={true}
      />

      <BoxDatePicker
        labelId='birthday'
        labelText='生年月日'
        name='birthday'
        value={supporterSignUpInput.birthday ?? ''}
        onChange={setSupporterSignUpTextInput}
        validationErrorMessages={validationErrors.birthday ?? []}
        needsMargin={true}
      />

      <ImageSelector
        labelId='front-identification'
        name='frontIdentification'
        labelText='身分証明書(表)'
        initialFileInput={supporterSignUpInput.frontIdentification}
        onChange={setSupporterSignUpFileInput}
        onCancel={clearSupporterSignUpFileInput}
        validationErrorMessages={validationErrors.frontIdentification ?? []}
      />

      <ImageSelector
        labelId='back-identification'
        name='backIdentification'
        labelText='身分証明書(裏)'
        initialFileInput={supporterSignUpInput.backIdentification}
        onChange={setSupporterSignUpFileInput}
        onCancel={clearSupporterSignUpFileInput}
        validationErrorMessages={validationErrors.backIdentification ?? []}
      />

      <SubmitButton labelText='確認画面へ' color='green' onClick={handleValidateSignUp} />
    </>
  );
};
