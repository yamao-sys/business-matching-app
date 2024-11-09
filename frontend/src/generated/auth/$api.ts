import type { AspidaClient, BasicHeaders } from 'aspida';
import type { Methods as Methods_uxnq38 } from './auth/validate_supporter_sign_up';

const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
  const prefix = (baseURL === undefined ? 'http://localhost:8080' : baseURL).replace(/\/$/, '');
  const PATH0 = '/auth/validate_supporter_sign_up';
  const POST = 'POST';

  return {
    auth: {
      validate_supporter_sign_up: {
        /**
         * validate sign up
         * @param option.body - Supporter Sign Up Iuput
         */
        post: (option: { body: Methods_uxnq38['post']['reqBody']; config?: T | undefined }) =>
          fetch<Methods_uxnq38['post']['resBody'], BasicHeaders, Methods_uxnq38['post']['status']>(
            prefix,
            PATH0,
            POST,
            option,
          ).json(),
        /**
         * validate sign up
         * @param option.body - Supporter Sign Up Iuput
         */
        $post: (option: { body: Methods_uxnq38['post']['reqBody']; config?: T | undefined }) =>
          fetch<Methods_uxnq38['post']['resBody'], BasicHeaders, Methods_uxnq38['post']['status']>(
            prefix,
            PATH0,
            POST,
            option,
          )
            .json()
            .then((r) => r.body),
        $path: () => `${prefix}${PATH0}`,
      },
    },
  };
};

export type ApiInstance = ReturnType<typeof api>;
export default api;
