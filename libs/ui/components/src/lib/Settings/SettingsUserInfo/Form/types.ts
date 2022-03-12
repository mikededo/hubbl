import { Gender } from '@hubbl/shared/types';

/**
 * Fields of the form, including non-required, used for validation
 */
export type SettingsUserInfoFields = {
  firstName: string;
  lastName: string;
  email: string;
  emailConfirmation: string;
  phone: string;
  gender: Gender;
};

/**
 * Strictly required fields for the form
 */
export type RequiredUserInfoFields = Pick<
  SettingsUserInfoFields,
  'firstName' | 'lastName' | 'email' | 'phone' | 'gender'
>;
