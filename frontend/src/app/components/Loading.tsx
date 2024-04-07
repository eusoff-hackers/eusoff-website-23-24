'use client'

import React from 'react'
import FakeNavBar from './FakeNavBar'

// Loading Page
export default function Loading() {
  return (
  <main className="flex flex-col md:flex-row">    
    <div className="h-screen flex justify-center items-center animate-spin text-2xl w-full"> 
        <h1>
            <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            height="3em"
            width="3em"
            className="m-auto">
                <path d="M12 4V2A10 10 0 002 12h2a8 8 0 018-8z" />
            </svg>
        </h1>
    </div>
  </main>)
}