import { render, screen } from '@testing-library/react';
import { SignUpBaseLayout } from '.';

describe('pages/auth/sign_up/components/SignUpBaseLayout', () => {
  test('フォーム画面では「登録情報の入力」が青色になること', () => {
    render(
      <SignUpBaseLayout phase={'form'}>
        <div>test</div>
      </SignUpBaseLayout>,
    );

    expect(screen.getByText('登録情報の入力')).toHaveClass('text-blue-300');
    expect(screen.getByText('登録情報の確認')).toHaveClass('text-gray-300');
    expect(screen.getByText('登録完了')).toHaveClass('text-gray-300');
    expect(screen.getByText('test')).toBeInTheDocument();
  });

  test('確認画面では「登録情報の確認」が青色になること', () => {
    render(
      <SignUpBaseLayout phase={'confirm'}>
        <div>test</div>
      </SignUpBaseLayout>,
    );

    expect(screen.getByText('登録情報の入力')).toHaveClass('text-gray-300');
    expect(screen.getByText('登録情報の確認')).toHaveClass('text-blue-300');
    expect(screen.getByText('登録完了')).toHaveClass('text-gray-300');
    expect(screen.getByText('test')).toBeInTheDocument();
  });

  test('サンクス画面では「登録完了」が青色になること', () => {
    render(
      <SignUpBaseLayout phase={'thanks'}>
        <div>test</div>
      </SignUpBaseLayout>,
    );

    expect(screen.getByText('登録情報の入力')).toHaveClass('text-gray-300');
    expect(screen.getByText('登録情報の確認')).toHaveClass('text-gray-300');
    expect(screen.getByText('登録完了')).toHaveClass('text-blue-300');
    expect(screen.getByText('test')).toBeInTheDocument();
  });
});
