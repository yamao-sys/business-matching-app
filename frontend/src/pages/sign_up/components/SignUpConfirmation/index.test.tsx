import { render, screen } from '@testing-library/react';
import { SignUpConfirmation } from '.';
import { SupporterSignUpContextProvider } from '../../contexts/SupporterSignUpContext';
import { CompanySignUpContextProvider } from '../../contexts/CompanySignUpContext';

const togglePhase = vi.fn();

describe('pages/auth/sign_up/components/SignUpConfirmation', () => {
  test('エンジニアの登録内容の確認画面が表示されること', () => {
    render(
      <SupporterSignUpContextProvider>
        <CompanySignUpContextProvider>
          <SignUpConfirmation formType='supporter' togglePhase={togglePhase} />
        </CompanySignUpContextProvider>
      </SupporterSignUpContextProvider>,
    );

    expect(screen.getByText('エンジニア登録入力内容')).toBeInTheDocument();
  });

  test('企業の登録内容の確認画面が表示されること', () => {
    render(
      <SupporterSignUpContextProvider>
        <CompanySignUpContextProvider>
          <SignUpConfirmation formType='company' togglePhase={togglePhase} />
        </CompanySignUpContextProvider>
      </SupporterSignUpContextProvider>,
    );

    expect(screen.getByText('企業登録入力内容')).toBeInTheDocument();
  });
});
