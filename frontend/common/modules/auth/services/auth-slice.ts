import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  error: null,
  loading: false,
  registerSuccess: false,
  becomeAHostSuccess: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = authSlice.actions;

export const authReducer = authSlice.reducer;
