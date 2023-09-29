'use client'

import React from 'react'
import { useRouter } from 'next/navigation'


export default function LoginButton() {
  const route = useRouter();

  return (
    <button onClick={() => route.push('/login')}className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"> 
      Login
    </button>
  )
}
