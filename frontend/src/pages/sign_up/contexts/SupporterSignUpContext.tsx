import { createContext, FC, useContext } from 'react';
import { useSignUp } from '../hooks/useSignUp';
import { SupporterSignUpInput } from '@/generated/auth/@types';

type Props = {
  children: React.ReactNode;
};

// Type
type SupporterSignUpSetStateContextType = {
  updateSignUpInput: (params: Partial<SupporterSignUpInput>) => void;
};

type SupporterSignUpStateContextType = {
  supporterSignUpInput: SupporterSignUpInput;
};

// Context
const SupporterSignUpStateContext = createContext({} as SupporterSignUpStateContextType);
const SupporterSignUpSetStateContext = createContext({} as SupporterSignUpSetStateContextType);

export const useSupporterSignUpStateContext = () => useContext(SupporterSignUpStateContext); // eslint-disable-line react-refresh/only-export-components
export const useSupporterSignUpSetStateContext = () => useContext(SupporterSignUpSetStateContext); // eslint-disable-line react-refresh/only-export-components

export const SupporterSignUpContextProvider: FC<Props> = ({ children }) => {
  const { supporterSignUpInput, updateSignUpInput } = useSignUp();

  return (
    <SupporterSignUpStateContext.Provider value={{ supporterSignUpInput }}>
      <SupporterSignUpSetStateContext.Provider value={{ updateSignUpInput }}>
        {children}
      </SupporterSignUpSetStateContext.Provider>
    </SupporterSignUpStateContext.Provider>
  );
};
