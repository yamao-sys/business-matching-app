import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { SignUpInput } from '.';
import { SupporterSignUpContextProvider } from '../../contexts/SupporterSignUpContext';

// userのセットアップ
const user = userEvent.setup();

const postValidateSignUp = vi.hoisted(() => vi.fn(() => ({ errors: {} })));
vi.mock('@/apis/authApi', async (importOriginal) => {
  const mod = await importOriginal<typeof import('@/apis/authApi')>();
  return {
    ...mod,
    postValidateSignUp,
  };
});

const togglePhase = vi.fn();

describe('pages/auth/sign_up/components/SignUpInput', () => {
  afterEach(() => {
    togglePhase.mockClear();
  });

  test('フォームが表示されること', () => {
    render(
      <SupporterSignUpContextProvider>
        <SignUpInput togglePhase={togglePhase} />
      </SupporterSignUpContextProvider>,
    );

    expect(screen.getByLabelText('姓')).toBeInTheDocument();
    expect(screen.getByLabelText('名')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('パスワード')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: '確認画面へ' })).toBeInTheDocument();
  });

  test('入力がフォームに反映されること', async () => {
    render(
      <SupporterSignUpContextProvider>
        <SignUpInput togglePhase={togglePhase} />
      </SupporterSignUpContextProvider>,
    );

    // NOTE: フォーム入力
    await user.type(screen.getByLabelText('姓'), 'type_last_name');
    expect(screen.getByLabelText('姓')).toHaveValue('type_last_name');

    await user.type(screen.getByLabelText('名'), 'type_first_name');
    expect(screen.getByLabelText('名')).toHaveValue('type_first_name');

    await user.type(screen.getByLabelText('Email'), 'type@example.com');
    expect(screen.getByLabelText('Email')).toHaveValue('type@example.com');

    await user.type(screen.getByLabelText('パスワード'), 'type_password');
    expect(screen.getByLabelText('パスワード')).toHaveValue('type_password');
  });

  describe('確認画面へボタンの押下', () => {
    describe('バリデーションエラーなしの時', () => {
      test('確認画面へ遷移できること', async () => {
        render(
          <SupporterSignUpContextProvider>
            <SignUpInput togglePhase={togglePhase} />
          </SupporterSignUpContextProvider>,
        );

        // NOTE: フォーム入力
        await user.type(screen.getByLabelText('姓'), 'type_last_name');
        expect(screen.getByLabelText('姓')).toHaveValue('type_last_name');

        await user.type(screen.getByLabelText('名'), 'type_first_name');
        expect(screen.getByLabelText('名')).toHaveValue('type_first_name');

        await user.type(screen.getByLabelText('Email'), 'type@example.com');
        expect(screen.getByLabelText('Email')).toHaveValue('type@example.com');

        await user.type(screen.getByLabelText('パスワード'), 'type_password');
        expect(screen.getByLabelText('パスワード')).toHaveValue('type_password');

        // NOTE: 確認画面への遷移アクションが実行されること
        const submitButtonElement = screen.getByRole('button', { name: '確認画面へ' });
        await user.click(submitButtonElement);

        expect(togglePhase).toHaveBeenCalled();
      });
    });

    describe('バリデーションエラーありの時', () => {
      beforeEach(() => {
        postValidateSignUp.mockResolvedValue({
          errors: {
            lastName: ['姓は必須入力です。'],
            firstName: ['名は必須入力です。'],
            email: ['Emailは必須入力です。'],
            password: ['パスワードは必須入力です。'],
          },
        });
      });

      test('バリデーションエラーが表示され、入力画面のままであること', async () => {
        render(
          <SupporterSignUpContextProvider>
            <SignUpInput togglePhase={togglePhase} />
          </SupporterSignUpContextProvider>,
        );

        const submitButtonElement = screen.getByRole('button', { name: '確認画面へ' });
        await user.click(submitButtonElement);

        expect(screen.getByText('姓は必須入力です。')).toBeInTheDocument();
        expect(screen.getByText('名は必須入力です。')).toBeInTheDocument();
        expect(screen.getByText('Emailは必須入力です。')).toBeInTheDocument();
        expect(screen.getByText('パスワードは必須入力です。')).toBeInTheDocument();
        expect(togglePhase).not.toHaveBeenCalled();
      });
    });
  });
});
