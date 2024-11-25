import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SupporterSignUpContextProvider } from '../../contexts/SupporterSignUpContext';
import { SignUpConfirmation } from '.';

// userのセットアップ
const user = userEvent.setup();

const useSupporterSignUpStateContext = vi.hoisted(() =>
  vi.fn(() => ({
    supporterSignUpInput: {
      lastName: 'test_last_name',
      firstName: 'test_first_name',
      email: 'test@example.com',
      password: 'Passwor1',
    },
  })),
);
vi.mock('../../contexts/SupporterSignUpContext', async (importOriginal) => {
  const mod = await importOriginal<typeof import('../../contexts/SupporterSignUpContext')>();
  return {
    ...mod,
    useSupporterSignUpStateContext,
  };
});

const postSignUp = vi.hoisted(() => vi.fn(() => ({ errors: {} })));
vi.mock('@/apis/authApi', async (importOriginal) => {
  const mod = await importOriginal<typeof import('@/apis/authApi')>();
  return {
    ...mod,
    postSignUp,
  };
});

const togglePhase = vi.fn();

describe('pages/auth/sign_up/components/SignUpConfirmation', () => {
  afterEach(() => {
    togglePhase.mockClear();
  });

  test('フォームから送られたデータが表示できること', () => {
    render(
      <SupporterSignUpContextProvider>
        <SignUpConfirmation togglePhase={togglePhase} />
      </SupporterSignUpContextProvider>,
    );

    expect(screen.getByText('test_last_name test_first_name')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('********')).toBeInTheDocument();
  });

  test('戻るボタンを押下すると、フォーム画面に戻るアクションが実行されること', async () => {
    render(
      <SupporterSignUpContextProvider>
        <SignUpConfirmation togglePhase={togglePhase} />
      </SupporterSignUpContextProvider>,
    );

    const backToFormButton = screen.getByRole('button', { name: '入力へ戻る' });
    await user.click(backToFormButton);

    expect(togglePhase).toHaveBeenCalled();
  });

  test('登録するボタンを押下すると、サンクス画面へ遷移するアクションが実行されること', async () => {
    render(
      <SupporterSignUpContextProvider>
        <SignUpConfirmation togglePhase={togglePhase} />
      </SupporterSignUpContextProvider>,
    );

    const backToFormButton = screen.getByRole('button', { name: '登録する' });
    await user.click(backToFormButton);

    expect(togglePhase).toHaveBeenCalled();
  });
});
