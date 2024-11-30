import { postSignUp } from '@/apis/authApi';
import { useSupporterSignUpStateContext } from '../../contexts/SupporterSignUpContext';
import { PhaseType } from '../../types';
import { BaseButton } from '@/components/atoms/BaseButton';
import { FC, useEffect, useState } from 'react';

type Props = {
  togglePhase: (newPhase: PhaseType) => void;
};

export const SupporterSignUpConfirmation: FC<Props> = ({ togglePhase }: Props) => {
  const { supporterSignUpInput } = useSupporterSignUpStateContext();

  const handleBackPage = () => togglePhase('input');

  const handleSignUp = async () => {
    try {
      await postSignUp(supporterSignUpInput);
      togglePhase('thanks');
    } catch (error) {
      // TODO: エラーハンドリング
      console.log(error);
    }
  };

  const [frontIdentificationImageUrl, setFrontIdentificationImageUrl] = useState<string>('');
  const [backIdentificationImageUrl, setBackIdentificationImageUrl] = useState<string>('');

  useEffect(() => {
    if (supporterSignUpInput.frontIdentification) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // base64のimageUrlを生成する。
        const base64 = reader && reader.result;
        if (base64 && typeof base64 === 'string') {
          setFrontIdentificationImageUrl(base64);
        }
      };
      reader.readAsDataURL(supporterSignUpInput.frontIdentification);
    }
    if (supporterSignUpInput.backIdentification) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // base64のimageUrlを生成する。
        const base64 = reader && reader.result;
        if (base64 && typeof base64 === 'string') {
          setBackIdentificationImageUrl(base64);
        }
      };
      reader.readAsDataURL(supporterSignUpInput.backIdentification);
    }
  }, [supporterSignUpInput, setFrontIdentificationImageUrl, setBackIdentificationImageUrl]);

  return (
    <>
      <h3 className='w-full text-center text-2xl font-bold'>エンジニア登録入力内容</h3>

      <div className='flex w-full justify-around mt-16'>
        <div className='w-1/2 align-middle'>ユーザ名: </div>
        <div className='w-1/2 align-middle'>{`${supporterSignUpInput.lastName} ${supporterSignUpInput.firstName}`}</div>
      </div>
      <div className='flex w-full justify-around mt-8'>
        <div className='w-1/2 align-middle'>メールアドレス: </div>
        <div className='w-1/2 align-middle'>{supporterSignUpInput.email}</div>
      </div>
      <div className='flex w-full justify-around mt-8'>
        <div className='w-1/2 align-middle'>パスワード: </div>
        <div className='w-1/2 align-middle'>{'*'.repeat(supporterSignUpInput.password.length)}</div>
      </div>
      <div className='flex w-full justify-around mt-8'>
        <div className='w-1/2 align-middle'>生年月日: </div>
        <div className='w-1/2 align-middle'>{supporterSignUpInput.birthday || '-'}</div>
      </div>
      <div className='flex w-full justify-around mt-8'>
        <div className='w-1/2 align-middle'>身分証明書(表): </div>
        <div className='w-1/2 align-middle'>
          <div
            style={{
              border: 'black 3px dotted',
              width: 360,
              height: 270,
              display: 'flex',
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              cursor: 'pointer',
            }}
          >
            {frontIdentificationImageUrl ? (
              <img
                src={frontIdentificationImageUrl}
                alt='アップロード画像_身分証明書(表)'
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            ) : (
              '-'
            )}
          </div>
        </div>
      </div>
      <div className='flex w-full justify-around mt-8'>
        <div className='w-1/2 align-middle'>身分証明書(裏): </div>
        <div className='w-1/2 align-middle'>
          <div
            style={{
              border: 'black 3px dotted',
              width: 360,
              height: 270,
              display: 'flex',
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              cursor: 'pointer',
            }}
          >
            {backIdentificationImageUrl ? (
              <img
                src={backIdentificationImageUrl}
                alt='アップロード画像_身分証明書(裏)'
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            ) : (
              '-'
            )}
          </div>
        </div>
      </div>
      <div className='flex w-full justify-around mt-16'>
        <BaseButton labelText='入力へ戻る' color='gray' onClick={handleBackPage} />
        <BaseButton labelText='登録する' color='green' onClick={handleSignUp} />
      </div>
    </>
  );
};
