export interface paths {
  '/companies/validateSignUp': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Company Validate SignUp
     * @description validate sign up
     */
    post: operations['post-auth-validate_sign_up'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/companies/signUp': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** Company SignUp */
    post: operations['post-auth-sign_up'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
}
export type webhooks = Record<string, never>;
export interface components {
  schemas: {
    /** CompanySignUpValidationError */
    CompanySignUpValidationError: {
      name?: string[];
      tel?: string[];
      email?: string[];
      password?: string[];
    };
  };
  responses: {
    CompanySignUpResponse: {
      headers: {
        [name: string]: unknown;
      };
      content: {
        'application/json': {
          /** Format: int64 */
          code: number;
          errors: components['schemas']['CompanySignUpValidationError'];
        };
      };
    };
    /** @description Internal Server Error Response */
    InternalServerErrorResponse: {
      headers: {
        [name: string]: unknown;
      };
      content: {
        'application/json': {
          /** Format: int64 */
          code: number;
          message: string;
        };
      };
    };
  };
  parameters: never;
  requestBodies: {
    /** @description SignUp Company Iuput */
    CompanySignUpInput: {
      content: {
        'application/json': {
          name: string;
          tel: string;
          email: string;
          password: string;
        };
      };
    };
  };
  headers: never;
  pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
  'post-auth-validate_sign_up': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: components['requestBodies']['CompanySignUpInput'];
    responses: {
      200: components['responses']['CompanySignUpResponse'];
      400: components['responses']['CompanySignUpResponse'];
      500: components['responses']['InternalServerErrorResponse'];
    };
  };
  'post-auth-sign_up': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: components['requestBodies']['CompanySignUpInput'];
    responses: {
      200: components['responses']['CompanySignUpResponse'];
      400: components['responses']['CompanySignUpResponse'];
      500: components['responses']['InternalServerErrorResponse'];
    };
  };
}
