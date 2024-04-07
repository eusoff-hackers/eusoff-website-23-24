import React from 'react';
import NavBar from '../components/NavBar';


export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <section className="h-screen flex flex-row">
        <div className='w-1/5'>
          <NavBar/>
        </div>
        <div className='w-full'>{children}</div>
    </section>
  )
}