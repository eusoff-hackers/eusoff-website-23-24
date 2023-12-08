"use client"; // This is a client component 👈🏽

import React, { useState, useEffect } from 'react'
import { removeUser } from '../redux/Resources/userSlice';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import NavBar from '../components/NavBar';

const InstructionsPage = () => {
  const route = useRouter();
  const dispatch = useDispatch();
  /*const [isNav, setIsNav] = useState(false);

  useEffect(() => {
    setIsNav(true);
  }, [])*/


  const logout = () => {
    dispatch(removeUser());
    route.push('/');
  }
  const searchParams = useSearchParams();
  const user = searchParams.get(`username`);
  return (
    <div className="flex-1 p-5 light:bg-white-800 text-black">
      <p className="font-bold mb-2 pb-2">Hi {user}, you are authenticated through NUS. Unfortunately, you are unauthorized to access the site because you are not a member of Eusoff Hall. If you think this is a mistake, contact administrator.</p>
    </div>
  )
}

export default InstructionsPage;
