import { FormType, PhaseType } from '../../types';
import { SignUpBaseLayout } from '../SignUpBaseLayout';
import { FC } from 'react';
import { SupporterSignUpConfirmation } from '../SupporterSignUpConfirmation';
import { CompanySignUpConfirmation } from '../CompanySignUpConfirmation';

type Props = {
  formType: FormType;
  togglePhase: (newPhase: PhaseType) => void;
};

export const SignUpConfirmation: FC<Props> = ({ formType, togglePhase }: Props) => {
  const confirmationComponent = () => {
    switch (formType) {
      case 'supporter':
        return <SupporterSignUpConfirmation togglePhase={togglePhase} />;
      case 'company':
        return <CompanySignUpConfirmation togglePhase={togglePhase} />;
    }
  };

  return (
    <>
      <SignUpBaseLayout phase='confirm'>{confirmationComponent()}</SignUpBaseLayout>
    </>
  );
};
