import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CompanySignUpConfirmation } from '.';
import { CompanySignUpContextProvider } from '../../contexts/CompanySignUpContext';

// userのセットアップ
const user = userEvent.setup();

const useCompanySignUpStateContext = vi.hoisted(() =>
  vi.fn(() => ({
    companySignUpInput: {
      name: 'test_name',
      tel: '012-3456-789',
      email: 'test@example.com',
      password: 'Passwor1',
    },
  })),
);
vi.mock('../../contexts/CompanySignUpContext', async (importOriginal) => {
  const mod = await importOriginal<typeof import('../../contexts/CompanySignUpContext')>();
  return {
    ...mod,
    useCompanySignUpStateContext,
  };
});

const postCompanySignUp = vi.hoisted(() => vi.fn(() => ({ errors: {} })));
vi.mock('@/apis/companiesApi', async (importOriginal) => {
  const mod = await importOriginal<typeof import('@/apis/companiesApi')>();
  return {
    ...mod,
    postCompanySignUp,
  };
});

const togglePhase = vi.fn();

describe('pages/auth/sign_up/components/CompanySignUpConfirmation', () => {
  afterEach(() => {
    togglePhase.mockClear();
  });

  test('フォームから送られたデータが表示できること', () => {
    render(
      <CompanySignUpContextProvider>
        <CompanySignUpConfirmation togglePhase={togglePhase} />
      </CompanySignUpContextProvider>,
    );

    expect(screen.getByText('企業登録入力内容')).toBeInTheDocument();

    expect(screen.getByText('test_name')).toBeInTheDocument();
    expect(screen.getByText('012-3456-789')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('********')).toBeInTheDocument();
  });

  test('戻るボタンを押下すると、フォーム画面に戻るアクションが実行されること', async () => {
    render(
      <CompanySignUpContextProvider>
        <CompanySignUpConfirmation togglePhase={togglePhase} />
      </CompanySignUpContextProvider>,
    );

    await user.click(screen.getByRole('button', { name: '入力へ戻る' }));

    expect(togglePhase).toHaveBeenCalled();
  });

  test('登録するボタンを押下すると、サンクス画面へ遷移するアクションが実行されること', async () => {
    render(
      <CompanySignUpContextProvider>
        <CompanySignUpConfirmation togglePhase={togglePhase} />
      </CompanySignUpContextProvider>,
    );

    await user.click(screen.getByRole('button', { name: '登録する' }));

    expect(togglePhase).toHaveBeenCalled();
  });
});
