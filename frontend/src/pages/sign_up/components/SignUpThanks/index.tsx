import { FC } from 'react';
import { SignUpBaseLayout } from '../SignUpBaseLayout';

export const SignUpThanks: FC = () => {
  return (
    <>
      <SignUpBaseLayout phase='thanks'>
        <div className='flex justify-center'>
          <div>会員登録が完了しました。</div>
          <div>ご登録いただきありがとうございます。</div>
        </div>
      </SignUpBaseLayout>
    </>
  );
};
