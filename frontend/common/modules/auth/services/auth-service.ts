import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import store from '@/common/modules/store';
import API from '@/common/modules/api';

import { setUser } from './auth-slice';

export type LoginActionPayload = {
  email: string;
  password: string;
};

export const login = createAsyncThunk<
  any,
  LoginActionPayload,
  { rejectValue: string }
>('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const { data } = await API.post('/account/session', { email, password });

    return data;
  } catch (error: any) {
    if (error.response?.status === 500) {
      if (error.response.data.includes('User not found')) {
        throw rejectWithValue('Invalid email or password');
      }
      throw rejectWithValue('Login failed. Please try again later.');
    }

    throw rejectWithValue(
      (error as AxiosError<any>).response?.data?.validation?.body?.message ||
        (error as AxiosError<any>).response?.data?.message ||
        'Unknown error',
    );
  }
});

export const getCurrentUser = createAsyncThunk<{
  rejectValue: AxiosError | Error;
}>('auth/getCurrentUser', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/account');

    return data;
  } catch (error) {
    console.log(error);

    throw rejectWithValue((error as AxiosError).response?.data);
  }
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  try {
    store.dispatch(setUser(null));

    return await API.delete('/account/session');
  } catch {
    // continue
  }
});
