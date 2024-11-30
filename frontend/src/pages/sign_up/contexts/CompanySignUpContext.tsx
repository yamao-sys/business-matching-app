import { createContext, FC, useContext } from 'react';
import { CompanySignUpInput, useCompanySignUp } from '../hooks/useCompanySignUp';

type Props = {
  children: React.ReactNode;
};

// Type
type CompanySignUpSetStateContextType = {
  updateCompanySignUpInput: (params: Partial<CompanySignUpInput>) => void;
};

type CompanySignUpStateContextType = {
  companySignUpInput: CompanySignUpInput;
};

// Context
const CompanySignUpStateContext = createContext({} as CompanySignUpStateContextType);
const CompanySignUpSetStateContext = createContext({} as CompanySignUpSetStateContextType);

export const useCompanySignUpStateContext = () => useContext(CompanySignUpStateContext); // eslint-disable-line react-refresh/only-export-components
export const useCompanySignUpSetStateContext = () => useContext(CompanySignUpSetStateContext); // eslint-disable-line react-refresh/only-export-components

export const CompanySignUpContextProvider: FC<Props> = ({ children }) => {
  const { companySignUpInput, updateCompanySignUpInput } = useCompanySignUp();

  return (
    <CompanySignUpStateContext.Provider value={{ companySignUpInput }}>
      <CompanySignUpSetStateContext.Provider value={{ updateCompanySignUpInput }}>
        {children}
      </CompanySignUpSetStateContext.Provider>
    </CompanySignUpStateContext.Provider>
  );
};
