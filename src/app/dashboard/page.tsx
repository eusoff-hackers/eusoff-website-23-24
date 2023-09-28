"use client"; // This is a client component 👈🏽

import React, { useState } from 'react'
 
import Link from "next/link"
import Modal from '../components/Modal/modal';

const Dashboard: React.FC = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

  const openModal = (index: number) => {
    setSelectedItemIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItemIndex(null);
    setIsModalOpen(false);
  };

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row">
      <nav className="w-full lg:w-64 bg-gray-800 text-white p-5">
        <h1 className="text-2xl mb-5">Dashboard</h1>
        <ul className="space-y-2">
          <li>
            <Link className="flex items-center gap-3 py-2" href="#">
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
            <Link className="flex items-center gap-3 py-2" href="#">
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
              <span>Users</span>
            </Link>
          </li>
          <li>
            <Link className="flex items-center gap-3 py-2" href="#">
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
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </nav>
      <main className="flex-1 p-5 light:bg-white-800 text-black">
        <h2 className="text-xl mb-5">Welcome back, User!</h2>
        <p>Here is the overview of your account:</p>
        <div className="grid pt-4 pl-7 grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-4 gap-y-5 mt-5">
      {Array.from({ length: 100 }, (_, index) => (
                <div
                  key={index}
                  className="bg-gray-800 h-16 w-16 flex items-center justify-center text-white font-semibold text-xl"
                  onClick = {() => openModal(index+1)}
                >
                       {index + 1}
                </div>
        ))}

         {isModalOpen && selectedItemIndex !== null && (
        <Modal closeModal={closeModal} index={selectedItemIndex} />
      )}

        </div>
      </main>
    </div>
  )
}

export default Dashboard;
