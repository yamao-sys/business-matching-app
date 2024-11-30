import { components, paths } from '@/generated/companies/apiSchema';
import { CompanySignUpInput } from '@/pages/sign_up/hooks/useCompanySignUp';
import createClient from 'openapi-fetch';

const client = createClient<paths>({
  baseUrl: 'http://localhost:8080/',
});

export const postValidateCompanySignUp = async (body: CompanySignUpInput) => {
  const { data, error } = await client.POST('/companies/validateSignUp', {
    body,
  });
  if (error?.code === 500) {
    throw Error();
  }

  return {
    errors: data?.errors ?? ([] as components['schemas']['CompanySignUpValidationError']),
  };
};

export const postCompanySignUp = async (body: CompanySignUpInput) => {
  const { data, error } = await client.POST('/companies/signUp', {
    body,
  });
  if (error?.code === 500) {
    throw Error();
  }

  return {
    errors: data?.errors ?? ([] as components['schemas']['CompanySignUpValidationError']),
  };
};

// export const postSignUp = async (input: SupporterSignUpInput) => {
//   const body = new FormData();
//   for (const [key, value] of Object.entries(input)) {
//     body.append(key, value)
//   }

//   const { data } = await client.P
// }

// export const postSignUp = async (data: SignUpDto) => {
//   const response = await getAuthApiClient().auth.signUp.post({
//     body: {
//       name: data.name,
//       email: data.email,
//       password: data.password,
//       passwordConfirm: data.passwordConfirm,
//     },
//   });

//   return { result: response.body.result };
// };

// export const postSignIn = async (data: SignInDto) => {
//   const response = await getAuthApiClient({ credentials: 'include' }).auth.signIn.post({
//     body: {
//       email: data.email,
//       password: data.password,
//     },
//   });

//   return response.body;
// };

// export const checkSignedIn = async () => {
//   return await getAuthApiClient({ credentials: 'include' }).auth.checkSignedIn.$get();
// };
