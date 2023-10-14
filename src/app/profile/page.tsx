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

  const [isClient, setIsClient] = useState(false);
  const [isNav, setIsNav] = useState(false);

  useEffect(() => {
    setIsNav(true);
  }, [])

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (user == null) {
        route.push('/');
    }
  }, [user, route]);


  const logout = () => {
    dispatch(removeUser());
    route.push('/');
  }


  return (
    !isClient || user == null ? <div>Loading...</div> : 
    <div className="bg-gradient-to-tl from-slate-200 to-slate-300 min-h-screen w-full flex flex-col lg:flex-row">
      { isNav && <NavBar/> }
      <main className="h-fit w-full">
        
        <div className="bg-gradient-to-r  from-cyan-500 to-blue-500 text-4xl text-zinc-950
                        font-mono m-0 p-2 font-bold uppercase hover:shadow-2xl text-center">
          Profile
        </div>

        <div className="bg-slate-200 mt-10 w-5/6 shadow-2xl text-3xl font-mono rounded-lg divide-y-5
                        m-auto grid grid-flow-row md:grid-flow-col gap-0 md:items-center py-10 px-5 mb-3">
          <div className=" bg-slate-200 text-center">
            <img className="border-dashed w-48 h-48 rounded-full border-4 border-indigo-950 m-auto shadow-2xl shadow-sky-200" 
            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" />
            <br/>
            <h1 className="text-black">
              logged in as <br /> <b>{user.username}</b>
            </h1>
          </div>

          <div className="min-w-full overflow-x-auto inline-block pt-4 md:pt-0 align-middle">
            <div className="border-2 border-indigo-950 rounded-lg">
              <table className="min-w-full shadow divide-y divide-gray-400">
                <tbody className="divide-y divide-gray-400">
                  <tr>
                    <th className="px-6 py-3 text-left text-base font-bold text-gray-500 uppercase">Username</th>
                    <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase">{user.username}</th>
                  </tr> 
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-gray-800">Year</td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">{user.year}</td>
                  </tr>

                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-green-500">Points</td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">{user.points}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-base font-bold  text-orange-500">Current Bids</td> 
                    <td className="py-5 grid grid-flow-row gap-y-1">
                      {user.bids.length > 0 
                      ? user.bids.map((item) => <p className="bg-gray-800 h-16 w-16 md:h-20 md:w-20 flex items-center justify-center text-white font-semibold text-xl md:text-2xl rounded-md hover:shadow-xl" key={item.jersey.number}>{item.jersey.number}</p>)
                      : <p className="font-light text-black">No current bids</p>} 
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-yellow-500">Allocated Number</td> 
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">
                      {user.allocatedNumber != null ? user.allocatedNumber : "None"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}

export default ProfilePage;
