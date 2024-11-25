import { render, screen } from '@testing-library/react';
import { SignUpThanks } from '.';

describe('pages/sign_up/components/SignUpThanks', () => {
  test('フォームが表示されること', () => {
    render(<SignUpThanks />);

    screen.getByText('会員登録が完了しました。');
  });
});
