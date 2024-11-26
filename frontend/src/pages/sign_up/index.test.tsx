import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SignUpPage } from '.';

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
      render(<SignUpPage />);

      // NOTE: フォーム入力
      await user.type(screen.getByLabelText('姓'), 'type_last_name');
      expect(screen.getByLabelText('姓')).toHaveValue('type_last_name');

      await user.type(screen.getByLabelText('名'), 'type_first_name');
      expect(screen.getByLabelText('名')).toHaveValue('type_first_name');

      await user.type(screen.getByLabelText('Email'), 'type@example.com');
      expect(screen.getByLabelText('Email')).toHaveValue('type@example.com');

      await user.type(screen.getByLabelText('パスワード'), 'type_password');
      expect(screen.getByLabelText('パスワード')).toHaveValue('type_password');

      // NOTE: 確認画面への遷移
      const submitButtonElement = screen.getByRole('button', { name: '確認画面へ' });
      await user.click(submitButtonElement);

      // NOTE: 確認画面へ遷移できていること
      expect(screen.getByRole('button', { name: '登録する' })).toBeInTheDocument();
    });
  });

  describe('確認画面', () => {
    test('確認画面 → フォーム画面へ戻り、入力内容が修正できること', async () => {
      render(<SignUpPage />);

      // NOTE: フォーム入力
      await user.type(screen.getByLabelText('姓'), 'type_last_name');
      await user.type(screen.getByLabelText('名'), 'type_first_name');
      await user.type(screen.getByLabelText('Email'), 'type@example.com');
      await user.type(screen.getByLabelText('パスワード'), 'type_password');

      // NOTE: 確認画面への遷移
      await user.click(screen.getByRole('button', { name: '確認画面へ' }));

      // NOTE: 確認画面 → フォーム画面へ戻れること
      await user.click(screen.getByRole('button', { name: '入力へ戻る' }));

      // NOTE: 入力内容を変更し、確認画面へ遷移できること
      await user.type(screen.getByLabelText('姓'), '_edited');
      await user.click(screen.getByRole('button', { name: '確認画面へ' }));
      expect(screen.getByText('登録情報の確認')).toHaveClass('text-blue-300');
      expect(screen.getByText('type_last_name_edited type_first_name')).toBeInTheDocument();
      expect(screen.getByText('type@example.com')).toBeInTheDocument();
      expect(screen.getByText('*************')).toBeInTheDocument();
    });

    test('確認画面 → サンクス画面へ遷移できること', async () => {
      render(<SignUpPage />);

      // NOTE: フォーム入力
      await user.type(screen.getByLabelText('姓'), 'type_last_name');
      await user.type(screen.getByLabelText('名'), 'type_first_name');
      await user.type(screen.getByLabelText('Email'), 'type@example.com');
      await user.type(screen.getByLabelText('パスワード'), 'type_password');

      // NOTE: 確認画面への遷移
      const submitButtonElement = screen.getByRole('button', { name: '確認画面へ' });
      await user.click(submitButtonElement);

      // NOTE: 確認画面 → サンクス画面への遷移ができること
      const submitButton = screen.getByRole('button', { name: '登録する' });
      await user.click(submitButton);
    });
  });
});
