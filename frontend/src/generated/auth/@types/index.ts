/* eslint-disable */
import type { ReadStream } from 'fs';

export type SupporterSignUpInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthday?: string | undefined;
  frontIdentification?: (File | ReadStream) | undefined;
  backIdentification?: (File | ReadStream) | undefined;
  skills?: number[] | undefined;
};

export type SupporterSignUpResponse = {
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
