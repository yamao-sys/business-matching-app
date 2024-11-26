import { components, paths } from '@/generated/auth/apiSchema';
import { SupporterSignUpInput } from '@/pages/sign_up/hooks/useSignUp';
import createClient from 'openapi-fetch';

const client = createClient<paths>({
  baseUrl: 'http://localhost:8080/',
});

export const postValidateSignUp = async (input: SupporterSignUpInput) => {
  const body = new FormData();
  for (const [key, value] of Object.entries(input)) {
    body.append(key, value);
  }

  const { data, error } = await client.POST('/auth/validateSignUp', {
    body: body as unknown as SupporterSignUpInput,
  });
  if (error?.code === 500) {
    throw Error();
  }

  return {
    errors: data?.errors ?? ([] as components['schemas']['SupporterSignUpValidationError']),
  };
};

export const postSignUp = async (input: SupporterSignUpInput) => {
  const body = new FormData();
  for (const [key, value] of Object.entries(input)) {
    body.append(key, value);
  }

  const { data, error } = await client.POST('/auth/signUp', {
    body: body as unknown as SupporterSignUpInput,
  });
  if (error?.code === 500) {
    throw Error();
  }

  return {
    errors: data?.errors ?? ([] as components['schemas']['SupporterSignUpValidationError']),
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
