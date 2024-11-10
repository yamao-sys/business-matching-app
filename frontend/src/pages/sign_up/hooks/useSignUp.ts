import { SupporterSignUpInput } from '@/generated/auth/@types';
import { useCallback, useState } from 'react';

export const useSignUp = () => {
  const [supporterSignUpInput, setSupporterSignUpInput] = useState<SupporterSignUpInput>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const updateSignUpInput = useCallback((params: Partial<SupporterSignUpInput>) => {
    setSupporterSignUpInput((prev) => ({ ...prev, ...params }));
  }, []);

  return {
    supporterSignUpInput,
    updateSignUpInput,
  };
};
