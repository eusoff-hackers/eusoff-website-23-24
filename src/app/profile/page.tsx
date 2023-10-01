"use client"; // This is a client component 👈🏽

import Link from 'next/link'

import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { removeUser, selectUser, User } from '../redux/Resources/userSlice';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';

const axios = require('axios');
const axiosWithCredentials = axios.create({
  withCredentials: true,
});

const ProfilePage = () => {
  // retrieve user data
  const user = useSelector(selectUser);
  const route = useRouter();

  const dispatch = useDispatch();

  const logout = () => {
    dispatch(removeUser());
    route.push('/');
  }

  if (user == null) {
    route.push("/");
  }

  return (
    user == null ? <div>Loading...</div> : 
    <div className="bg-gradient-to-tl from-slate-200 to-slate-300 min-h-screen w-full flex flex-col lg:flex-row">

      {/* nav bar here*/}
      <nav className="w-full lg:w-64 bg-gray-800 text-white p-5">
        <h1 className="text-2xl mb-5">Dashboard</h1>
        <ul className="space-y-2">
          <li>
            <Link className="flex items-center gap-3 py-2" href="/dashboard">
              <svg
                className=" h-5 w-5"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link className="flex items-center gap-3 py-2" href="/profile">
              <svg
                className=" h-5 w-5"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>Profile</span>
            </Link>
          </li>
          <li>
            <Link className="flex items-center gap-3 py-2" href="/instructions">
              <svg
                className=" h-5 w-5"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span>Instructions</span>
            </Link>
          </li>
          <li>
            <Link className="flex items-center gap-3 py-2" onClick={logout} href="/">
              <svg
                className=" h-5 w-5"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Logout
            </Link>
          </li>
        </ul>
      </nav>

      <main className="bg-gradient-to-tl from-slate-200 to-slate-300 h-fit w-full">
        
        <div className="bg-gradient-to-r  from-cyan-500 to-blue-500 text-4xl text-zinc-950
                        font-mono  text-center m-0 p-2 font-bold uppercase hover:shadow-2xl">
          Profile
        </div>
        <div className="bg-slate-200 mt-10 md:w-3/5 w-5/6 shadow-2xl text-3xl font-mono rounded-lg object-center  text-center
                        sm  m-auto md:py-20 py-10 mb-3 border-0 border-slate-900">
          <img className="border-dashed w-48 h-48 bg-center rounded-lg border-4 border-indigo-950 m-auto hover:shadow-2xl" 
          src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" />
          <h1 className="text-black">
            logged in as <br /> <b>{user.username}</b>
          </h1>
          <br />
          <h2 className="text-green-500 font-bold hover:text-green-600" > 
            <b>Points</b> 
            <br /> 
            {-1}
          </h2>
          <br />
          <h2 className="text-orange-500 font-bold">
            <b className="font-bold hover:text-orange-600">Bids</b> 
            <br />
            <div className="flex mt-2 justify-items-center justify-evenly">
              {user.bids.length > 0 
              ? user.bids.map((item) => <p className="bg-gray-800 h-16 w-16 md:h-20 md:w-20 flex items-center justify-center text-white font-semibold text-xl md:text-2xl rounded-md hover:shadow-xl" key={item.jersey.number}>{item.jersey.number}</p>)
              : <p className="font-light text-black">No current bids</p>} 
             </div>
          </h2>
        </div>
      </main>
    </div>
  )
}

export default ProfilePage;
