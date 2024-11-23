export interface paths {
    "/auth/validateSignUp": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Validate SignUp
         * @description validate sign up
         */
        post: operations["post-auth-validate_sign_up"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/signUp": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** SignUp */
        post: operations["post-auth-sign_up"];
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
        /** SupporterSignUpValidationError */
        SupporterSignUpValidationError: {
            firstName?: string[];
            lastName?: string[];
            email?: string[];
            password?: string[];
            frontIdentification?: string[];
            backIdentification?: string[];
            skills?: string[];
        };
    };
    responses: {
        SupporterSignUpResponse: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": {
                    /** Format: int64 */
                    code: number;
                    errors: components["schemas"]["SupporterSignUpValidationError"];
                };
            };
        };
        /** @description Internal Server Error Response */
        InternalServerErrorResponse: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": {
                    /** Format: int64 */
                    code: number;
                    message: string;
                };
            };
        };
    };
    parameters: never;
    requestBodies: {
        /** @description SignUp Supporter Iuput */
        SupporterSignUpInput: {
            content: {
                "multipart/form-data": {
                    firstName: string;
                    lastName: string;
                    email: string;
                    password: string;
                    birthday: string;
                    /** Format: binary */
                    frontIdentification?: Blob;
                    /** Format: binary */
                    backIdentification?: Blob;
                    skills?: string;
                };
            };
        };
    };
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    "post-auth-validate_sign_up": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: components["requestBodies"]["SupporterSignUpInput"];
        responses: {
            200: components["responses"]["SupporterSignUpResponse"];
            400: components["responses"]["SupporterSignUpResponse"];
            500: components["responses"]["InternalServerErrorResponse"];
        };
    };
    "post-auth-sign_up": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: components["requestBodies"]["SupporterSignUpInput"];
        responses: {
            200: components["responses"]["SupporterSignUpResponse"];
            400: components["responses"]["SupporterSignUpResponse"];
            500: components["responses"]["InternalServerErrorResponse"];
        };
    };
}
