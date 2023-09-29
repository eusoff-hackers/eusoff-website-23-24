'use client';

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  username: string,
  bids: any[],
}

const initialState: User | null = null;


export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action ) => action.payload,
  },
});

export const { setUser } = userSlice.actions;
export const selectUser = (state: { user: User | null }) => state.user;
export default userSlice.reducer;