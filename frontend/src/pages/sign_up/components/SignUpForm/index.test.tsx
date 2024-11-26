import { render, screen } from '@testing-library/react';
import { SupporterSignUpContextProvider } from '../../contexts/SupporterSignUpContext';
import { SignUpForm } from '.';
import userEvent from '@testing-library/user-event';

// userのセットアップ
const user = userEvent.setup();

const postValidateSignUp = vi.hoisted(() => vi.fn(() => ({ errors: {} })));
const postSignUp = vi.hoisted(() => vi.fn(() => ({ errors: {} })));
vi.mock('@/apis/authApi', async (importOriginal) => {
  const mod = await importOriginal<typeof import('@/apis/authApi')>();
  return {
    ...mod,
    postValidateSignUp,
    postSignUp,
  };
});

describe('pages/auth/sign_up/components/SignUpForm', () => {
  describe('フォーム画面', () => {
    test('フォーム画面 → 確認画面へ遷移できること', async () => {
      render(
        <SupporterSignUpContextProvider>
          <SignUpForm />
        </SupporterSignUpContextProvider>,
      );

      // NOTE: 確認画面への遷移
      await user.click(screen.getByRole('button', { name: '確認画面へ' }));

      // NOTE: 確認画面へ遷移できていること
      expect(screen.getByRole('button', { name: '登録する' })).toBeInTheDocument();
    });
  });

  describe('確認画面', () => {
    test('確認画面 → フォーム画面へ戻り、入力内容が修正できること', async () => {
      render(
        <SupporterSignUpContextProvider>
          <SignUpForm />
        </SupporterSignUpContextProvider>,
      );

      // NOTE: 確認画面への遷移
      await user.click(screen.getByRole('button', { name: '確認画面へ' }));

      // NOTE: 確認画面 → フォーム画面へ戻れること
      await user.click(screen.getByRole('button', { name: '入力へ戻る' }));
    });

    test('確認画面 → サンクス画面へ遷移できること', async () => {
      render(
        <SupporterSignUpContextProvider>
          <SignUpForm />
        </SupporterSignUpContextProvider>,
      );

      // NOTE: 確認画面への遷移
      await user.click(screen.getByRole('button', { name: '確認画面へ' }));

      // NOTE: 確認画面 → サンクス画面への遷移ができること
      await user.click(screen.getByRole('button', { name: '登録する' }));
    });
  });
});
