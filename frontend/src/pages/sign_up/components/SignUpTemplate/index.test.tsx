import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SignUpTemplate } from '.';

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

describe('pages/auth/sign_up/components/SignUpTemplate', () => {
  test('フォーム画面で入力ができること', async () => {
    render(<SignUpTemplate />);

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

  test('フォーム画面で入力した内容が確認画面で表示できること', async () => {
    render(<SignUpTemplate />);

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
    await user.click(screen.getByRole('button', { name: '確認画面へ' }));

    // NOTE: 確認画面で入力内容が表示できていること
    expect(screen.getByRole('button', { name: '登録する' })).toBeInTheDocument();
    expect(screen.getByText('type_last_name type_first_name')).toBeInTheDocument();
    expect(screen.getByText('type@example.com')).toBeInTheDocument();
    expect(screen.getByText('*************')).toBeInTheDocument();
  });

  test('確認画面 → フォーム画面に遷移すると、入力した内容表示できること', async () => {
    render(<SignUpTemplate />);

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
    await user.click(screen.getByRole('button', { name: '確認画面へ' }));

    // NOTE: フォーム画面へ戻ると、入力内容が維持されていること
    await user.click(screen.getByRole('button', { name: '入力へ戻る' }));
    expect(screen.getByLabelText('姓')).toHaveValue('type_last_name');
    expect(screen.getByLabelText('名')).toHaveValue('type_first_name');
    expect(screen.getByLabelText('Email')).toHaveValue('type@example.com');
    expect(screen.getByLabelText('パスワード')).toHaveValue('type_password');
  });
});
