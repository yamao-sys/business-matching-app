import { render, screen } from '@testing-library/react';
import { SignUpInput } from '.';
import { SupporterSignUpContextProvider } from '../../contexts/SupporterSignUpContext';
import { CompanySignUpContextProvider } from '../../contexts/CompanySignUpContext';

const togglePhase = vi.fn();
const switchFormType = vi.fn();

describe('pages/auth/sign_up/components/SignUpInput', () => {
  afterEach(() => {
    togglePhase.mockClear();
  });

  describe('フォームが表示されること', () => {
    test('エンジニア', () => {
      render(
        <SupporterSignUpContextProvider>
          <CompanySignUpContextProvider>
            <SignUpInput
              formType='supporter'
              switchFormType={switchFormType}
              togglePhase={togglePhase}
            />
          </CompanySignUpContextProvider>
        </SupporterSignUpContextProvider>,
      );

      expect(screen.getByText('エンジニア登録フォーム')).toBeInTheDocument();
    });

    test('企業', () => {
      render(
        <SupporterSignUpContextProvider>
          <CompanySignUpContextProvider>
            <SignUpInput
              formType='company'
              switchFormType={switchFormType}
              togglePhase={togglePhase}
            />
          </CompanySignUpContextProvider>
        </SupporterSignUpContextProvider>,
      );

      expect(screen.getByText('企業登録フォーム')).toBeInTheDocument();
    });
  });
});
