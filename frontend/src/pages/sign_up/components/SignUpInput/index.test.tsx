import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { SignUpInput } from '.';
import { SupporterSignUpContextProvider } from '../../contexts/SupporterSignUpContext';

import fs from 'fs';

// userのセットアップ
const user = userEvent.setup();

const buffer = fs.readFileSync('/src/public/noimage.png');
const inputFile = new File([buffer], 'identification.png', { type: 'image/png' });

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
    expect(screen.getByLabelText('生年月日')).toBeInTheDocument();
    // NOTE: 画像部はlabel内にフォームを含むためgetByLabelTextで取得できず → getByText
    expect(screen.getByText('身分証明書(表)')).toBeInTheDocument();
    expect(screen.getByText('身分証明書(裏)')).toBeInTheDocument();

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

    await user.type(screen.getByLabelText('生年月日'), '1992-07-07');
    expect(screen.getByLabelText('生年月日')).toHaveValue('1992-07-07');

    await user.upload(screen.getByTestId('front-identification'), inputFile);
    expect(screen.getByAltText('アップロード画像_身分証明書(表)')).toBeInTheDocument();

    await user.upload(screen.getByTestId('back-identification'), inputFile);
    expect(screen.getByAltText('アップロード画像_身分証明書(裏)')).toBeInTheDocument();
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
        await user.type(screen.getByLabelText('名'), 'type_first_name');
        await user.type(screen.getByLabelText('Email'), 'type@example.com');
        await user.type(screen.getByLabelText('パスワード'), 'type_password');
        await user.upload(screen.getByTestId('front-identification'), inputFile);
        await user.upload(screen.getByTestId('back-identification'), inputFile);

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
            frontIdentification: [
              '身分証明書(表)の拡張子はwebp, png, jpegのいずれかでお願いします。',
            ],
            backIdentification: [
              '身分証明書(裏)の拡張子はwebp, png, jpegのいずれかでお願いします。',
            ],
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
        expect(
          screen.getByText('身分証明書(表)の拡張子はwebp, png, jpegのいずれかでお願いします。'),
        ).toBeInTheDocument();
        expect(
          screen.getByText('身分証明書(裏)の拡張子はwebp, png, jpegのいずれかでお願いします。'),
        ).toBeInTheDocument();
        expect(togglePhase).not.toHaveBeenCalled();
      });
    });
  });
});
