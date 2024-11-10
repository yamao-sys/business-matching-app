import { FC } from 'react';
import { SignUpForm } from '../SignUpForm';
import { SupporterSignUpContextProvider } from '../../contexts/SupporterSignUpContext';

export const SignUpTemplate: FC = () => {
  return (
    <>
      <SupporterSignUpContextProvider>
        <SignUpForm />
      </SupporterSignUpContextProvider>
    </>
  );
};
