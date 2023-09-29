'use client'

import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux/es/hooks/useSelector'
import { RootState } from '../redux/store'
import { selectUser } from '../redux/Resources/userSlice';
import { useDispatch } from 'react-redux';

export default function Page() {
  const user = useSelector(selectUser);
  console.log("This is the user: " + user)

  return (
    <div>
      <p>Dashboard</p>
      <p>{user?.username}</p>
    </div>
  )
}
