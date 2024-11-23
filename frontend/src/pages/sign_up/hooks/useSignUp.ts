import { components } from '@/generated/auth/apiSchema';
import { useCallback, useState } from 'react';

export type SupporterSignUpInput =
  components['requestBodies']['SupporterSignUpInput']['content']['multipart/form-data'];

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

  const clearIdentificationKey = (keyToRemove: 'frontIdentification' | 'backIdentification') => {
    setSupporterSignUpInput((prev) => {
      const { [keyToRemove]: _, ...rest } = prev; // eslint-disable-line @typescript-eslint/no-unused-vars
      return rest;
    });
  };

  return {
    supporterSignUpInput,
    updateSignUpInput,
    clearIdentificationKey,
  };
};
