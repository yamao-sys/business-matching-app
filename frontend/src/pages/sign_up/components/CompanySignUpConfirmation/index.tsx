import { PhaseType } from '../../types';
import { BaseButton } from '@/components/atoms/BaseButton';
import { FC } from 'react';
import { useCompanySignUpStateContext } from '../../contexts/CompanySignUpContext';
import { postCompanySignUp } from '@/apis/companiesApi';

type Props = {
  togglePhase: (newPhase: PhaseType) => void;
};

export const CompanySignUpConfirmation: FC<Props> = ({ togglePhase }: Props) => {
  const { companySignUpInput } = useCompanySignUpStateContext();

  const handleBackPage = () => togglePhase('input');

  const handleSignUp = async () => {
    try {
      await postCompanySignUp(companySignUpInput);
      togglePhase('thanks');
    } catch (error) {
      // TODO: エラーハンドリング
      console.log(error);
    }
  };

  return (
    <>
      <h3 className='w-full text-center text-2xl font-bold'>企業登録入力内容</h3>

      <div className='flex w-full justify-around'>
        <div className='w-1/2 align-middle'>企業名: </div>
        <div className='w-1/2 align-middle'>{companySignUpInput.name}</div>
      </div>
      <div className='flex w-full justify-around mt-8'>
        <div className='w-1/2 align-middle'>電話番号: </div>
        <div className='w-1/2 align-middle'>{companySignUpInput.tel}</div>
      </div>
      <div className='flex w-full justify-around mt-8'>
        <div className='w-1/2 align-middle'>メールアドレス: </div>
        <div className='w-1/2 align-middle'>{companySignUpInput.email}</div>
      </div>
      <div className='flex w-full justify-around mt-8'>
        <div className='w-1/2 align-middle'>パスワード: </div>
        <div className='w-1/2 align-middle'>{'*'.repeat(companySignUpInput.password.length)}</div>
      </div>

      <div className='flex w-full justify-around mt-16'>
        <BaseButton labelText='入力へ戻る' color='gray' onClick={handleBackPage} />
        <BaseButton labelText='登録する' color='green' onClick={handleSignUp} />
      </div>
    </>
  );
};
