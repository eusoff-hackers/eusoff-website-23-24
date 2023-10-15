'use client'

import React, { useState, useEffect } from 'react'
import { setUser, selectUser, User } from '../redux/Resources/userSlice';
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';

const axios = require('axios').default;
axios.defaults.withCredentials = true;

export default function LoginForm() {
  const user = useSelector(selectUser);
  const router = useRouter();

  useEffect(() => {
    if (user !== null) {
      router.push(`/dashboard`);
    }
  });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/login`, {
        credentials: {
          username,
          password,
        },
      });

      if (response.data.success) {

        console.log('This is the auth response' + JSON.stringify(response.data.data))
        const newUser : User = {
          username: response.data.data.user.username,
          teams: response.data.data.user.teams,
          bids: response.data.data.user.bids,
          isEligible: response.data.data.user.isEligible,
          role: response.data.data.user.role,
          year: response.data.data.user.year,
          points: response.data.data.user.points,
          round: response.data.data.user.bidding_round
        }

        dispatch(setUser(newUser));
        router.replace("/dashboard");
      } 
    } catch (error) {
      const axiosError = error as AxiosError;

        if(axiosError.response.status == 401) {
          setError("Invalid username or password")
          console.error("Unauthorised")
        }
      console.error('Error during login', error);
    }
  };

  return (
    <div className="bg-white p-10 flex flex-col w-full shadow-xl rounded-xl">
      <h2 className="text-2xl font-bold text-gray-800 text-left mb-5">
        Login
      </h2>
      <form onSubmit={(e) => handleSubmit(e)} className="w-full">
        <div id="input" className="flex flex-col w-full my-5">
          <label htmlFor="username" className="text-gray-500 mb-2"
            >Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Please insert your room number"
            className="appearance-none text-black border-2 border-gray-100 rounded-lg px-4 py-3 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:shadow-lg"
          />
        </div>
        <div id="input" className="flex flex-col w-full my-5">
          <label htmlFor="password" className="text-gray-500 mb-2"
            >Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Please insert your password"
            className="appearance-none border-2 text-black border-gray-100 rounded-lg px-4 py-3 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:shadow-lg"
          />
        </div>
        { error == '' ? <></> : <div className='font-bold text-red-500'>{error}!</div>} 
        <div id="button" className="flex flex-col w-full my-5">
          <button
            type="submit"
            className="w-full py-4 bg-green-600 rounded-lg text-green-100"
          >
            <div className="flex flex-row items-center justify-center">
              <div className="mr-2">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  ></path>
                </svg>
              </div>
              <div className="font-bold">Sign In</div>
            </div>
          </button>
        </div>
      </form>
    </div>
  )
}
