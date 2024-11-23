import { createContext, FC, useContext } from 'react';
import { SupporterSignUpInput, useSignUp } from '../hooks/useSignUp';

type Props = {
  children: React.ReactNode;
};

// Type
type SupporterSignUpSetStateContextType = {
  updateSignUpInput: (params: Partial<SupporterSignUpInput>) => void;
  clearIdentificationKey: (keyToRemove: 'frontIdentification' | 'backIdentification') => void;
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
  const { supporterSignUpInput, updateSignUpInput, clearIdentificationKey } = useSignUp();

  return (
    <SupporterSignUpStateContext.Provider value={{ supporterSignUpInput }}>
      <SupporterSignUpSetStateContext.Provider
        value={{ updateSignUpInput, clearIdentificationKey }}
      >
        {children}
      </SupporterSignUpSetStateContext.Provider>
    </SupporterSignUpStateContext.Provider>
  );
};
