import { FC, memo } from 'react';
import { BaseLayout } from '../BaseLayout';

type Props = {
  phase: 'form' | 'confirm' | 'thanks';
  children: React.ReactNode;
};

export const SignUpBaseLayout: FC<Props> = memo<Props>(function SignUpBaseLayout({
  phase,
  children,
}: Props) {
  console.log('Sign Up Base Layout rendered');

  return (
    <>
      <BaseLayout>
        <div className='flex justify-between mb-16'>
          <div>
            <span className={phase === 'form' ? 'text-blue-300' : 'text-gray-300'}>
              登録情報の入力
            </span>
          </div>
          <div className='text-gray-300'>&gt;&gt;</div>

          <div>
            <span className={phase === 'confirm' ? 'text-blue-300' : 'text-gray-300'}>
              登録情報の確認
            </span>
          </div>
          <div className='text-gray-300'>&gt;&gt;</div>

          <div>
            <span className={phase === 'thanks' ? 'text-blue-300' : 'text-gray-300'}>登録完了</span>
          </div>
        </div>
        {children}
      </BaseLayout>
    </>
  );
});
