import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { CompanySignUpInput } from '.';
import { CompanySignUpContextProvider } from '../../contexts/CompanySignUpContext';

// userのセットアップ
const user = userEvent.setup();

const postValidateCompanySignUp = vi.hoisted(() => vi.fn(() => ({ errors: {} })));
vi.mock('@/apis/companiesApi', async (importOriginal) => {
  const mod = await importOriginal<typeof import('@/apis/companiesApi')>();
  return {
    ...mod,
    postValidateCompanySignUp,
  };
});

const formType = 'company';
const switchFormType = vi.fn();
const togglePhase = vi.fn();

describe('pages/auth/sign_up/components/CompanySignUpInput', () => {
  afterEach(() => {
    togglePhase.mockClear();
  });

  test('フォームが表示されること', () => {
    render(
      <CompanySignUpContextProvider>
        <CompanySignUpInput
          formType={formType}
          switchFormType={switchFormType}
          togglePhase={togglePhase}
        />
      </CompanySignUpContextProvider>,
    );

    expect(screen.getByText('企業登録フォーム')).toBeInTheDocument();

    expect(screen.getByLabelText('企業名')).toBeInTheDocument();
    expect(screen.getByLabelText('電話番号')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('パスワード')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: '確認画面へ' })).toBeInTheDocument();
  });

  test('入力がフォームに反映されること', async () => {
    render(
      <CompanySignUpContextProvider>
        <CompanySignUpInput
          formType={formType}
          switchFormType={switchFormType}
          togglePhase={togglePhase}
        />
      </CompanySignUpContextProvider>,
    );

    // NOTE: フォーム入力
    await user.type(screen.getByLabelText('企業名'), 'type_name');
    expect(screen.getByLabelText('企業名')).toHaveValue('type_name');

    await user.type(screen.getByLabelText('電話番号'), '012-3456-789');
    expect(screen.getByLabelText('電話番号')).toHaveValue('012-3456-789');

    await user.type(screen.getByLabelText('Email'), 'type@example.com');
    expect(screen.getByLabelText('Email')).toHaveValue('type@example.com');

    await user.type(screen.getByLabelText('パスワード'), 'type_password');
    expect(screen.getByLabelText('パスワード')).toHaveValue('type_password');
  });

  describe('確認画面へボタンの押下', () => {
    describe('バリデーションエラーなしの時', () => {
      test('確認画面へ遷移できること', async () => {
        render(
          <CompanySignUpContextProvider>
            <CompanySignUpInput
              formType={formType}
              switchFormType={switchFormType}
              togglePhase={togglePhase}
            />
          </CompanySignUpContextProvider>,
        );

        // NOTE: フォーム入力
        await user.type(screen.getByLabelText('企業名'), 'type_name');
        await user.type(screen.getByLabelText('電話番号'), '012-3456-789');
        await user.type(screen.getByLabelText('Email'), 'type@example.com');
        await user.type(screen.getByLabelText('パスワード'), 'type_password');

        // NOTE: 確認画面への遷移アクションが実行されること
        const submitButtonElement = screen.getByRole('button', { name: '確認画面へ' });
        await user.click(submitButtonElement);

        expect(togglePhase).toHaveBeenCalled();
      });
    });

    describe('バリデーションエラーありの時', () => {
      beforeEach(() => {
        postValidateCompanySignUp.mockResolvedValue({
          errors: {
            name: ['企業名は必須入力です。'],
            tel: ['電話番号は必須入力です。'],
            email: ['Emailは必須入力です。'],
            password: ['パスワードは必須入力です。'],
          },
        });
      });

      test('バリデーションエラーが表示され、入力画面のままであること', async () => {
        render(
          <CompanySignUpContextProvider>
            <CompanySignUpInput
              formType={formType}
              switchFormType={switchFormType}
              togglePhase={togglePhase}
            />
          </CompanySignUpContextProvider>,
        );

        const submitButtonElement = screen.getByRole('button', { name: '確認画面へ' });
        await user.click(submitButtonElement);

        expect(screen.getByText('企業名は必須入力です。')).toBeInTheDocument();
        expect(screen.getByText('電話番号は必須入力です。')).toBeInTheDocument();
        expect(screen.getByText('Emailは必須入力です。')).toBeInTheDocument();
        expect(screen.getByText('パスワードは必須入力です。')).toBeInTheDocument();
      });
    });
  });

  test('フォーム種別の切り替えができること', async () => {
    render(
      <CompanySignUpContextProvider>
        <CompanySignUpInput
          formType={formType}
          switchFormType={switchFormType}
          togglePhase={togglePhase}
        />
      </CompanySignUpContextProvider>,
    );

    await user.click(screen.getByRole('radio', { name: 'エンジニア' }));

    expect(switchFormType).toHaveBeenCalled();
  });
});
