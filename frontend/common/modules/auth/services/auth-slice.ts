import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  error: null,
  loading: false,
  registerSuccess: false,
  becomeAHostSuccess: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase('auth/getCurrentUser/pending', (state, action) => {
        state.loading = true;
      })
      .addCase('auth/getCurrentUser/fulfilled', (state, action) => {
        // @ts-ignore
        state.user = action.payload;
        state.loading = false;

        if (window.location.href == (process.env.NEXT_PUBLIC_APP_URL as string))
          window.location.href = process.env.NEXT_PUBLIC_APP_URL + '/home';
      })
      .addCase('auth/getCurrentUser/rejected', (state, action) => {
        // @ts-ignore
        state.error = action.payload;
        state.loading = false;

        if (window.location.href != (process.env.NEXT_PUBLIC_APP_URL as string))
          window.location.href = process.env.NEXT_PUBLIC_APP_URL as string;
      })
      .addCase('auth/login/pending', (state, action) => {
        state.loading = true;
      })
      .addCase('auth/login/fulfilled', (state, action) => {
        // @ts-ignore
        state.user = action.payload;
        state.loading = false;

        if (window.location.href == (process.env.NEXT_PUBLIC_APP_URL as string))
          window.location.href = process.env.NEXT_PUBLIC_APP_URL + '/home';
      })
      .addCase('auth/login/rejected', (state, action) => {
        // @ts-ignore
        state.error = action.payload;
        state.loading = false;
      })
      .addCase('auth/logoutUser/pending', (state, action) => {
        state.loading = true;
      })
      .addCase('auth/logoutUser/fulfilled', (state, action) => {
        state.user = null;
        state.loading = false;
        window.location.href = process.env.NEXT_PUBLIC_APP_URL as string;
      });
  },
});

export const { setUser } = authSlice.actions;

export default authSlice.reducer;
