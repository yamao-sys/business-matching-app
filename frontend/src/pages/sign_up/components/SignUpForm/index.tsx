import { FC, useState } from 'react';
import { PhaseType } from '../../types';
import { SignUpInput } from '../SignUpInput';

export const SignUpForm: FC = () => {
  const [phase, setPhase] = useState<PhaseType>('input');
  const togglePhase = (newPhase: PhaseType) => setPhase(newPhase);

  const phaseComponent = () => {
    switch (phase) {
      case 'input':
        return <SignUpInput togglePhase={togglePhase} />;
      case 'confirmation':
        // return <SignUpConfirmation togglePhase={togglePhase} />;
        return <></>;
      case 'thanks':
        // return <SignUpThanks />;
        return <></>;
    }
  };

  return <>{phaseComponent()}</>;
};
