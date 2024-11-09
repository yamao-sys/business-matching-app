/* eslint-disable */
import type { DefineMethods } from 'aspida';
import type * as Types from '../../@types';

export type Methods = DefineMethods<{
  /** validate sign up */
  post: {
    status: 200;

    resBody: {
      code: number;

      errors: {
        firstName?: string[] | undefined;
        lastName?: string[] | undefined;
        email?: string[] | undefined;
        password?: string[] | undefined;
        frontIdentification?: string[] | undefined;
        backIdenfitication?: string[] | undefined;
        skills?: string[] | undefined;
      };
    };

    /** Supporter Sign Up Iuput */
    reqBody: Types.SupporterSignUpInput;
  };
}>;
