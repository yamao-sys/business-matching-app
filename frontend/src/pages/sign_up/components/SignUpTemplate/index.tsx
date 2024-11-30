import { FC } from 'react';
import { SignUpForm } from '../SignUpForm';
import { SupporterSignUpContextProvider } from '../../contexts/SupporterSignUpContext';
import { CompanySignUpContextProvider } from '../../contexts/CompanySignUpContext';

export const SignUpTemplate: FC = () => {
  return (
    <>
      <SupporterSignUpContextProvider>
        <CompanySignUpContextProvider>
          <SignUpForm />
        </CompanySignUpContextProvider>
      </SupporterSignUpContextProvider>
    </>
  );
};
