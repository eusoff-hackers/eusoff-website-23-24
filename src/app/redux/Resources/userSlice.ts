'use client';

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface User {
    username: string,
    bids: any[],
}

const initialState: User = {
    username: '',
    bids: [],
}


export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => action.payload,
  },
});

export const { setUser } = userSlice.actions;
export const selectUser = (state: User) => state;
export default userSlice.reducer;