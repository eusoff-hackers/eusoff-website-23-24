'use client';

import { configureStore } from '@reduxjs/toolkit';
import userReducer, { User } from './Resources/userSlice';

// Saves user data into a session storage
const saveState = (state: User | null) => {
  try {
      // Convert the state to a JSON string 
      const serialisedState = JSON.stringify(state);

      // Save the serialised state to localStorage against the key 'app_state'
      localStorage.setItem('user_state', serialisedState);
  } catch (err) {
      // Log errors here, or ignore
      console.error(err);
  }
};

// Checks if user is saved in session storage 
const loadState = () => {
  try {
      if (typeof window === `undefined`) return null;
      const serialisedState = localStorage.getItem('user_state');
      console.log("Session saved:" + serialisedState)

      // Passing undefined to createStore will result in our app getting the default state
      // If no data is saved, return undefined
      if (!serialisedState) return null;

      const item = JSON.parse(serialisedState);
      return item
  } catch (err) {
    console.error(err);
    return null;
  }
};

const oldState = loadState()
const savedUser : User | null = oldState == null ? null : {
  username: oldState.username,
  bids: oldState.bids,
  teams: oldState.teams,
  isEligible: oldState.isEligible,
  role: oldState.role,
  year: oldState.year,
  points: oldState.points,
  allocatedNumber: oldState.allocatedNumber,
  round: oldState.round
}
console.log("This is saved user :" + JSON.stringify(savedUser))

export const store = configureStore({
    reducer: {
      user: userReducer,
    },
    preloadedState: {user: savedUser}
})

store.subscribe(() => {
  console.log("This is store state:" + store.getState().user)
  saveState(store.getState().user)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;