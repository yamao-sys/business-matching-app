import { FC, useState } from 'react';
import { FormType, PhaseType } from '../../types';
import { SignUpInput } from '../SignUpInput';
import { SignUpConfirmation } from '../SignUpConfirmation';
import { SignUpThanks } from '../SignUpThanks';

export const SignUpForm: FC = () => {
  const [phase, setPhase] = useState<PhaseType>('input');
  const [formType, setFormType] = useState<FormType>('supporter');
  const togglePhase = (newPhase: PhaseType) => setPhase(newPhase);

  const phaseComponent = () => {
    switch (phase) {
      case 'input':
        return (
          <SignUpInput formType={formType} switchFormType={setFormType} togglePhase={togglePhase} />
        );
      case 'confirmation':
        return <SignUpConfirmation formType={formType} togglePhase={togglePhase} />;
      case 'thanks':
        return <SignUpThanks />;
    }
  };

  return <>{phaseComponent()}</>;
};
