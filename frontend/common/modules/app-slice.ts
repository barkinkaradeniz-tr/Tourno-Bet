import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  modal: null,
  mobileModal: null,
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setModal: (state, action) => {
      state.modal = action.payload
    },
    setMobileModal: (state, action) => {
      state.mobileModal = action.payload
    },
  },
})

export const { setModal, setMobileModal } = appSlice.actions

export const appReducer = appSlice.reducer
