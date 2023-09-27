'use client'

import React, { useState } from 'react'
import { setUser } from '../redux/Resources/userSlice';
import { useDispatch } from 'react-redux';

const axios = require('axios').default;

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/user/login', {
        credentials: {
          username,
          password,
        },
      });

      if (response.data.success) {
        const newUser = {
          username: response.data.data.user.username, 
          bids: response.data.data.user.bids
        }

        console.log(newUser)
        dispatch(setUser(newUser));
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error during login', error);
    }
  };

  
  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={(e) => handleSubmit(e)} className="bg-white p-8 rounded shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center justify-between">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Log In
          </button>
        </div>
      </form>
    </div>
  )
}
