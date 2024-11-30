import { render, screen } from '@testing-library/react';
import { SupporterSignUpContextProvider } from '../../contexts/SupporterSignUpContext';
import { SignUpForm } from '.';
import userEvent from '@testing-library/user-event';
import { CompanySignUpContextProvider } from '../../contexts/CompanySignUpContext';

// userのセットアップ
const user = userEvent.setup();

// エンジニア登録関連のAPIのMock
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

// 企業登録関連のAPIのMock
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

describe('pages/auth/sign_up/components/SignUpForm', () => {
  describe('フォーム画面', () => {
    test('フォーム画面 → 確認画面へ遷移できること(エンジニア)', async () => {
      render(
        <SupporterSignUpContextProvider>
          <CompanySignUpContextProvider>
            <SignUpForm />
          </CompanySignUpContextProvider>
        </SupporterSignUpContextProvider>,
      );

      // NOTE: 確認画面への遷移
      await user.click(screen.getByRole('button', { name: '確認画面へ' }));
      expect(screen.getByText('エンジニア登録入力内容')).toBeInTheDocument();

      // NOTE: 確認画面へ遷移できていること
      expect(screen.getByRole('button', { name: '登録する' })).toBeInTheDocument();
    });

    test('フォーム画面 → 確認画面へ遷移できること(企業)', async () => {
      render(
        <SupporterSignUpContextProvider>
          <CompanySignUpContextProvider>
            <SignUpForm />
          </CompanySignUpContextProvider>
        </SupporterSignUpContextProvider>,
      );

      await user.click(screen.getByRole('radio', { name: '企業' }));

      // NOTE: 確認画面への遷移
      await user.click(screen.getByRole('button', { name: '確認画面へ' }));
      expect(screen.getByText('企業登録入力内容')).toBeInTheDocument();

      // NOTE: 確認画面へ遷移できていること
      expect(screen.getByRole('button', { name: '登録する' })).toBeInTheDocument();
    });
  });

  describe('確認画面', () => {
    describe('確認画面 → フォーム画面へ戻れること', () => {
      test('エンジニア', async () => {
        render(
          <SupporterSignUpContextProvider>
            <CompanySignUpContextProvider>
              <SignUpForm />
            </CompanySignUpContextProvider>
          </SupporterSignUpContextProvider>,
        );

        // NOTE: 確認画面への遷移
        await user.click(screen.getByRole('button', { name: '確認画面へ' }));
        expect(screen.getByText('エンジニア登録入力内容')).toBeInTheDocument();

        // NOTE: 確認画面 → フォーム画面へ戻れること
        await user.click(screen.getByRole('button', { name: '入力へ戻る' }));
      });

      test('企業', async () => {
        render(
          <SupporterSignUpContextProvider>
            <CompanySignUpContextProvider>
              <SignUpForm />
            </CompanySignUpContextProvider>
          </SupporterSignUpContextProvider>,
        );

        await user.click(screen.getByRole('radio', { name: '企業' }));

        // NOTE: 確認画面への遷移
        await user.click(screen.getByRole('button', { name: '確認画面へ' }));
        expect(screen.getByText('企業登録入力内容')).toBeInTheDocument();

        // NOTE: 確認画面 → フォーム画面へ戻れること
        await user.click(screen.getByRole('button', { name: '入力へ戻る' }));
      });
    });

    describe('確認画面 → フォーム画面へ戻り → フォーム種別変更 → 再び確認画面へ遷移できること', () => {
      test('エンジニア → 企業へ', async () => {
        render(
          <SupporterSignUpContextProvider>
            <CompanySignUpContextProvider>
              <SignUpForm />
            </CompanySignUpContextProvider>
          </SupporterSignUpContextProvider>,
        );

        // NOTE: 確認画面への遷移
        await user.click(screen.getByRole('button', { name: '確認画面へ' }));
        expect(screen.getByText('エンジニア登録入力内容')).toBeInTheDocument();

        // NOTE: 確認画面 → フォーム画面へ戻れること
        await user.click(screen.getByRole('button', { name: '入力へ戻る' }));

        await user.click(screen.getByRole('radio', { name: '企業' }));
        await user.click(screen.getByRole('button', { name: '確認画面へ' }));
        expect(screen.getByText('企業登録入力内容')).toBeInTheDocument();
      });

      test('企業 → エンジニア', async () => {
        render(
          <SupporterSignUpContextProvider>
            <CompanySignUpContextProvider>
              <SignUpForm />
            </CompanySignUpContextProvider>
          </SupporterSignUpContextProvider>,
        );

        await user.click(screen.getByRole('radio', { name: '企業' }));

        // NOTE: 確認画面への遷移
        await user.click(screen.getByRole('button', { name: '確認画面へ' }));
        expect(screen.getByText('企業登録入力内容')).toBeInTheDocument();

        // NOTE: 確認画面 → フォーム画面へ戻れること
        await user.click(screen.getByRole('button', { name: '入力へ戻る' }));

        await user.click(screen.getByRole('radio', { name: 'エンジニア' }));
        await user.click(screen.getByRole('button', { name: '確認画面へ' }));
        expect(screen.getByText('エンジニア登録入力内容')).toBeInTheDocument();
      });
    });

    describe('確認画面 → サンクス画面へ遷移できること', () => {
      test('エンジニア', async () => {
        render(
          <SupporterSignUpContextProvider>
            <CompanySignUpContextProvider>
              <SignUpForm />
            </CompanySignUpContextProvider>
          </SupporterSignUpContextProvider>,
        );

        // NOTE: 確認画面への遷移
        await user.click(screen.getByRole('button', { name: '確認画面へ' }));
        expect(screen.getByText('エンジニア登録入力内容')).toBeInTheDocument();

        // NOTE: 確認画面 → サンクス画面への遷移ができること
        await user.click(screen.getByRole('button', { name: '登録する' }));
      });

      test('企業', async () => {
        render(
          <SupporterSignUpContextProvider>
            <CompanySignUpContextProvider>
              <SignUpForm />
            </CompanySignUpContextProvider>
          </SupporterSignUpContextProvider>,
        );

        await user.click(screen.getByRole('radio', { name: '企業' }));

        // NOTE: 確認画面への遷移
        await user.click(screen.getByRole('button', { name: '確認画面へ' }));
        expect(screen.getByText('企業登録入力内容')).toBeInTheDocument();

        // NOTE: 確認画面 → サンクス画面への遷移ができること
        await user.click(screen.getByRole('button', { name: '登録する' }));
      });
    });
  });
});
