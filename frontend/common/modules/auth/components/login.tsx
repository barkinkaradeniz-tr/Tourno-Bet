import React, { useEffect } from 'react';
import Image from 'next/image';
import { useFormik } from 'formik';
import Logo from '@/public/images/logo.png';
import { getLoginValidationSchema } from '../services/validationSchema';
import { useDispatch } from 'react-redux';
import { login } from '../services/auth-service';
import { useAppSelector } from '@/common/modules/store';

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const { loading, error } = useAppSelector(state => state.auth);

  const loginForm = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: getLoginValidationSchema(),
    onSubmit: async values => {
      // @ts-ignore
      dispatch(login(values));
    },
    validateOnChange: true,
    validateOnBlur: false,
    isInitialValid: false,
    validateOnMount: true,
  });

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    loginForm.setFieldTouched();
  }, []);

  return (
    <div className="bg-gradient-to-b from-cyan-100 to-sky-700 relative backdrop-blur-sm w-full h-full bg-fixed z-10">
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white border-4 border-double border-sky-500 shadow-md rounded-lg">
          <div className="flex justify-center">
            <Image className="w-48 h-48 rounded-full" src={Logo} alt="logo" />
          </div>
          <div className="rounded px-8 pt-6 pb-8">
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Enter your email"
                value={loginForm.values.email}
                onChange={loginForm.handleChange('email')}
                disabled={loading}
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="Enter your password"
                value={loginForm.values.password}
                onChange={loginForm.handleChange('password')}
                disabled={loading}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={loginForm.submitForm}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
