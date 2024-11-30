import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { FormTypeSelector } from '.';

// userのセットアップ
const user = userEvent.setup();

const switchFormType = vi.fn();

describe('pages/auth/sign_up/components/FormTypeSelector', () => {
  afterEach(() => {
    switchFormType.mockClear();
  });

  test('フォーム種別切り替え部が表示されること', () => {
    render(<FormTypeSelector formType='supporter' switchFormType={switchFormType} />);

    expect(screen.getByRole('radio', { name: 'エンジニア' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '企業' })).toBeInTheDocument();
  });

  test('フォーム種別の切り替えができること(エンジニア → 企業)', async () => {
    render(<FormTypeSelector formType='supporter' switchFormType={switchFormType} />);

    await user.click(screen.getByRole('radio', { name: '企業' }));

    expect(switchFormType).toHaveBeenCalled();
  });

  test('フォーム種別の切り替えができること(企業 → エンジニア)', async () => {
    render(<FormTypeSelector formType='company' switchFormType={switchFormType} />);

    await user.click(screen.getByRole('radio', { name: 'エンジニア' }));

    expect(switchFormType).toHaveBeenCalled();
  });
});
