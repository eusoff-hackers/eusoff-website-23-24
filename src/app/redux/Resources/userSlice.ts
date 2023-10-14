'use client';

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  username: string,
  teams: any[],
  bids: any[],
  isEligible: boolean,
  role: string, 
  year: number,
  points: number
}

const initialState: User | null = null;


export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action ) => action.payload,
    removeUser: (state) => null
  },
});

export const { setUser, removeUser } = userSlice.actions;
export const selectUser = (state: { user: User | null }) => state.user;
export default userSlice.reducer;