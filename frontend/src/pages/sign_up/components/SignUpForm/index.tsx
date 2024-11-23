import { FC, useState } from 'react';
import { PhaseType } from '../../types';
import { SignUpInput } from '../SignUpInput';
import { SignUpConfirmation } from '../SignUpConfirmation';
import { SignUpThanks } from '../SignUpThanks';

export const SignUpForm: FC = () => {
  const [phase, setPhase] = useState<PhaseType>('input');
  const togglePhase = (newPhase: PhaseType) => setPhase(newPhase);

  const phaseComponent = () => {
    switch (phase) {
      case 'input':
        return <SignUpInput togglePhase={togglePhase} />;
      case 'confirmation':
        return <SignUpConfirmation togglePhase={togglePhase} />;
      case 'thanks':
        return <SignUpThanks />;
    }
  };

  return <>{phaseComponent()}</>;
};
