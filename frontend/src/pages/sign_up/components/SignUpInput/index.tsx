import { FC } from 'react';
import { SignUpBaseLayout } from '../SignUpBaseLayout';
import { FormType, PhaseType } from '../../types';
import { SupporterSignUpInput } from '../SupporterSignUpInput';
import { CompanySignUpInput } from '../CompanySignUpInput';

type Props = {
  formType: FormType;
  switchFormType: (toFormType: FormType) => void;
  togglePhase: (newPhase: PhaseType) => void;
};

export const SignUpInput: FC<Props> = ({ formType, switchFormType, togglePhase }: Props) => {
  const formComponent = () => {
    switch (formType) {
      case 'supporter':
        return (
          <SupporterSignUpInput
            togglePhase={togglePhase}
            formType={formType}
            switchFormType={switchFormType}
          />
        );
      case 'company':
        return (
          <CompanySignUpInput
            togglePhase={togglePhase}
            formType={formType}
            switchFormType={switchFormType}
          />
        );
    }
  };

  return (
    <>
      <SignUpBaseLayout phase='form'>{formComponent()}</SignUpBaseLayout>
    </>
  );
};
