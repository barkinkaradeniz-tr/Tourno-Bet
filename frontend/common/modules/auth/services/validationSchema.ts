import Router from 'next/router';
import * as Yup from 'yup';

export const getLoginValidationSchema = () => {
  return Yup.object().shape({
    email: Yup.string()
      .email('Invalid email')
      .required('Email is required')
      .transform((email: string) => email.toLowerCase().trim()),
    password: Yup.string().required('Password is required'),
  });
};
