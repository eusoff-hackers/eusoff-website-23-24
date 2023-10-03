"use client"; // This is a client component 👈🏽

import Link from 'next/link'

import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { removeUser, selectUser, User } from '../redux/Resources/userSlice';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import NavBar from '../components/NavBar';

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

  useEffect(() => {
    if (user == null) {
      route.push('/');
    }
  }, [user, route]);

  return (
    user == null ? <div>Loading...</div> : 
    <div className="bg-gradient-to-tl from-slate-200 to-slate-300 min-h-screen w-full flex flex-col lg:flex-row">
      <NavBar/>
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
