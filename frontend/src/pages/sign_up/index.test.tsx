import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SignUpPage } from '.';

import fs from 'fs';

// userのセットアップ
const user = userEvent.setup();

const buffer = fs.readFileSync('/src/public/noimage.png');
const inputFile = new File([buffer], 'identification.png', { type: 'image/png' });

// NOTE: エンジニアの登録関連APIのMock
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

// NOTE: 企業の登録関連APIのMock
const postValidateCompanySignUp = vi.hoisted(() => vi.fn(() => ({ errors: {} })));
const postCompanySignUp = vi.hoisted(() => vi.fn(() => ({ errors: {} })));
vi.mock('@/apis/companiesApi', async (importOriginal) => {
  const mod = await importOriginal<typeof import('@/apis/companiesApi')>();
  return {
    ...mod,
    postValidateCompanySignUp,
    postCompanySignUp,
  };
});

describe('pages/auth/sign_up/SignUpPage', () => {
  describe('フォーム画面', () => {
    describe('フォーム画面 → 確認画面へ遷移できること', () => {
      test('エンジニア', async () => {
        render(<SignUpPage />);

        expect(screen.getByText('エンジニア登録フォーム')).toBeInTheDocument();

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

      test('企業', async () => {
        render(<SignUpPage />);

        expect(screen.getByText('エンジニア登録フォーム')).toBeInTheDocument();

        await user.click(screen.getByRole('radio', { name: '企業' }));

        // NOTE: フォーム入力
        await user.type(screen.getByLabelText('企業名'), 'type_name');
        expect(screen.getByLabelText('企業名')).toHaveValue('type_name');

        await user.type(screen.getByLabelText('電話番号'), '012-3456-789');
        expect(screen.getByLabelText('電話番号')).toHaveValue('012-3456-789');

        await user.type(screen.getByLabelText('Email'), 'type@example.com');
        expect(screen.getByLabelText('Email')).toHaveValue('type@example.com');

        await user.type(screen.getByLabelText('パスワード'), 'type_password');
        expect(screen.getByLabelText('パスワード')).toHaveValue('type_password');

        // NOTE: 確認画面への遷移
        const submitButtonElement = screen.getByRole('button', { name: '確認画面へ' });
        await user.click(submitButtonElement);

        // NOTE: 確認画面へ遷移できていること
        expect(screen.getByText('企業登録入力内容')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '登録する' })).toBeInTheDocument();
      });
    });
  });

  describe('確認画面', () => {
    describe('確認画面 → フォーム画面へ戻り、入力内容が修正できること', () => {
      test('エンジニア', async () => {
        render(<SignUpPage />);

        expect(screen.getByText('エンジニア登録フォーム')).toBeInTheDocument();

        // NOTE: フォーム入力
        await user.type(screen.getByLabelText('姓'), 'type_last_name');
        await user.type(screen.getByLabelText('名'), 'type_first_name');
        await user.type(screen.getByLabelText('Email'), 'type@example.com');
        await user.type(screen.getByLabelText('パスワード'), 'type_password');
        await user.type(screen.getByLabelText('生年月日'), '1992-07-07');
        await user.upload(screen.getByTestId('front-identification'), inputFile);
        await user.upload(screen.getByTestId('back-identification'), inputFile);

        // NOTE: 確認画面への遷移
        await user.click(screen.getByRole('button', { name: '確認画面へ' }));

        // NOTE: 確認画面 → フォーム画面へ戻れること
        await user.click(screen.getByRole('button', { name: '入力へ戻る' }));

        // NOTE: 入力内容を変更し、確認画面へ遷移できること
        await user.type(screen.getByLabelText('姓'), '_edited');
        await user.clear(screen.getByLabelText('生年月日'));
        await user.click(screen.getByRole('button', { name: '確認画面へ' }));
        expect(screen.getByText('登録情報の確認')).toHaveClass('text-blue-300');
        expect(screen.getByText('type_last_name_edited type_first_name')).toBeInTheDocument();
        expect(screen.getByText('type@example.com')).toBeInTheDocument();
        expect(screen.getByText('*************')).toBeInTheDocument();
        expect(screen.getByText('-')).toBeInTheDocument(); // NOTE: 生年月日は空値の時は「-」
        expect(screen.getByAltText('アップロード画像_身分証明書(表)')).toBeInTheDocument();
        expect(screen.getByAltText('アップロード画像_身分証明書(裏)')).toBeInTheDocument();
      });

      test('企業', async () => {
        render(<SignUpPage />);

        expect(screen.getByText('エンジニア登録フォーム')).toBeInTheDocument();

        await user.click(screen.getByRole('radio', { name: '企業' }));
        // NOTE: フォーム入力
        await user.type(screen.getByLabelText('企業名'), 'type_name');
        await user.type(screen.getByLabelText('電話番号'), '012-3456-789');
        await user.type(screen.getByLabelText('Email'), 'type@example.com');
        await user.type(screen.getByLabelText('パスワード'), 'type_password');

        // NOTE: 確認画面への遷移
        await user.click(screen.getByRole('button', { name: '確認画面へ' }));
        expect(screen.getByText('企業登録入力内容')).toBeInTheDocument();

        // NOTE: 確認画面 → フォーム画面へ戻れること
        await user.click(screen.getByRole('button', { name: '入力へ戻る' }));

        // NOTE: 入力内容を変更し、確認画面へ遷移できること
        await user.type(screen.getByLabelText('企業名'), '_edited');
        await user.click(screen.getByRole('button', { name: '確認画面へ' }));
        expect(screen.getByText('登録情報の確認')).toHaveClass('text-blue-300');
        expect(screen.getByText('企業登録入力内容')).toBeInTheDocument();
        expect(screen.getByText('type_name_edited')).toBeInTheDocument();
        expect(screen.getByText('012-3456-789')).toBeInTheDocument();
        expect(screen.getByText('type@example.com')).toBeInTheDocument();
        expect(screen.getByText('*************')).toBeInTheDocument();
      });

      test('フォーム種別を切り替えられる', async () => {
        render(<SignUpPage />);

        expect(screen.getByText('エンジニア登録フォーム')).toBeInTheDocument();

        // NOTE: フォーム入力
        await user.type(screen.getByLabelText('姓'), 'type_last_name');
        await user.type(screen.getByLabelText('名'), 'type_first_name');
        await user.type(screen.getByLabelText('Email'), 'type@example.com');
        await user.type(screen.getByLabelText('パスワード'), 'type_password');
        await user.type(screen.getByLabelText('生年月日'), '1992-07-07');
        await user.upload(screen.getByTestId('front-identification'), inputFile);
        await user.upload(screen.getByTestId('back-identification'), inputFile);

        // NOTE: 確認画面への遷移
        await user.click(screen.getByRole('button', { name: '確認画面へ' }));

        // NOTE: 確認画面 → フォーム画面へ戻れること
        await user.click(screen.getByRole('button', { name: '入力へ戻る' }));

        // NOTE: 入力内容を変更し、確認画面へ遷移できること
        await user.click(screen.getByRole('radio', { name: '企業' }));
        // NOTE: フォーム入力
        await user.type(screen.getByLabelText('企業名'), 'type_name');
        await user.type(screen.getByLabelText('電話番号'), '012-3456-789');
        await user.type(screen.getByLabelText('Email'), 'type_company@example.com');
        await user.type(screen.getByLabelText('パスワード'), 'type_company_password');

        // NOTE: 確認画面への遷移
        await user.click(screen.getByRole('button', { name: '確認画面へ' }));
        expect(screen.getByText('企業登録入力内容')).toBeInTheDocument();

        // NOTE: 確認画面 → フォーム画面へ戻り修正できること
        await user.click(screen.getByRole('button', { name: '入力へ戻る' }));
        expect(screen.getByText('企業登録フォーム')).toBeInTheDocument();

        await user.type(screen.getByLabelText('企業名'), '_edited');
        await user.click(screen.getByRole('button', { name: '確認画面へ' }));
        expect(screen.getByText('登録情報の確認')).toHaveClass('text-blue-300');
        expect(screen.getByText('企業登録入力内容')).toBeInTheDocument();
        expect(screen.getByText('type_name_edited')).toBeInTheDocument();
        expect(screen.getByText('012-3456-789')).toBeInTheDocument();
        expect(screen.getByText('type_company@example.com')).toBeInTheDocument();
        expect(screen.getByText('*********************')).toBeInTheDocument();
      });
    });

    describe('確認画面 → サンクス画面へ遷移できること', () => {
      test('エンジニア', async () => {
        render(<SignUpPage />);

        // NOTE: フォーム入力
        await user.type(screen.getByLabelText('姓'), 'type_last_name');
        await user.type(screen.getByLabelText('名'), 'type_first_name');
        await user.type(screen.getByLabelText('Email'), 'type@example.com');
        await user.type(screen.getByLabelText('パスワード'), 'type_password');
        await user.type(screen.getByLabelText('生年月日'), '1992-07-07');
        await user.upload(screen.getByTestId('front-identification'), inputFile);
        await user.upload(screen.getByTestId('back-identification'), inputFile);

        // NOTE: 確認画面への遷移
        const submitButtonElement = screen.getByRole('button', { name: '確認画面へ' });
        await user.click(submitButtonElement);
        expect(screen.getByText('エンジニア登録入力内容')).toBeInTheDocument();

        // NOTE: 確認画面 → サンクス画面への遷移ができること
        const submitButton = screen.getByRole('button', { name: '登録する' });
        await user.click(submitButton);
        expect(screen.getByText('会員登録が完了しました。')).toBeInTheDocument();
      });

      test('企業', async () => {
        render(<SignUpPage />);

        expect(screen.getByText('エンジニア登録フォーム')).toBeInTheDocument();

        await user.click(screen.getByRole('radio', { name: '企業' }));
        // NOTE: フォーム入力
        await user.type(screen.getByLabelText('企業名'), 'type_name');
        await user.type(screen.getByLabelText('電話番号'), '012-3456-789');
        await user.type(screen.getByLabelText('Email'), 'type@example.com');
        await user.type(screen.getByLabelText('パスワード'), 'type_password');

        // NOTE: 確認画面への遷移
        const submitButtonElement = screen.getByRole('button', { name: '確認画面へ' });
        await user.click(submitButtonElement);
        expect(screen.getByText('企業登録入力内容')).toBeInTheDocument();

        // NOTE: 確認画面 → サンクス画面への遷移ができること
        const submitButton = screen.getByRole('button', { name: '登録する' });
        await user.click(submitButton);
        expect(screen.getByText('会員登録が完了しました。')).toBeInTheDocument();
      });
    });
  });
});
