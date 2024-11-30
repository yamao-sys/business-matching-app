import { components } from '@/generated/companies/apiSchema';
import { useCallback, useState } from 'react';

export type CompanySignUpInput =
  components['requestBodies']['CompanySignUpInput']['content']['application/json'];

export const useCompanySignUp = () => {
  const [companySignUpInput, setCompanySignUpInput] = useState<CompanySignUpInput>({
    name: '',
    tel: '',
    email: '',
    password: '',
  });

  const updateCompanySignUpInput = useCallback((params: Partial<CompanySignUpInput>) => {
    setCompanySignUpInput((prev) => ({ ...prev, ...params }));
  }, []);

  return {
    companySignUpInput,
    updateCompanySignUpInput,
  };
};
