'use client'

import React, { useState } from "react";
import Link from "next/link"
import { useDispatch } from 'react-redux'
import { removeUser } from '../redux/Resources/userSlice'
import { useRouter } from 'next/navigation'

import { HiMenuAlt3 } from "react-icons/hi";
import { MdOutlineDashboard } from "react-icons/md";
import { RiSettings4Line } from "react-icons/ri";
import { TbReportAnalytics } from "react-icons/tb";
import { AiOutlineUser, AiOutlineHeart } from "react-icons/ai";
import { FiMessageSquare, FiFolder, FiShoppingCart } from "react-icons/fi";

const axios = require('axios'); 
axios.defaults.withCredentials = true;

export default function NavBar() {

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/logout`)
    } catch (error) {
      console.error("Logout error")
    }
  }

  const route = useRouter()
  const dispatch = useDispatch()

  const logout = () => {
    dispatch(removeUser());
    localStorage.clear();
    handleLogout();
    route.push('/');
  }

return (
    <nav className="lg:min-h-screen w-full lg:w-64 bg-gray-800 text-white p-5">
      <p className="text-2xl mb-5">Dashboard</p>
      <ul className="space-y-2">
        <li className="hover:translate-x-1">
          <Link className="flex items-center gap-3 py-2" href="/dashboard/profile">
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
        <li className="hover:translate-x-1">
          <Link className="flex items-center gap-3 py-2" href="/dashboard/instructions">
            <svg
                className="h-5 w-5"
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
                <rect x="3" y="2" width="14" height="20" />
                <line x1="3" y1="7" x2="17" y2="7" />
                <line x1="3" y1="11" x2="17" y2="11" />
                <line x1="3" y1="15" x2="17" y2="15" />
            </svg>
            <span>Jersey Instructions</span>
          </Link>
        </li>
        <li className="hover:translate-x-1">
          <Link className="flex items-center gap-3 py-2" href="/dashboard/jersey" onClick={e => e.preventDefault()}>
            <svg
                className="h-5 w-5"
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
                <rect x="3" y="2" width="14" height="20" />
                <line x1="3" y1="7" x2="17" y2="7" />
                <line x1="3" y1="11" x2="17" y2="11" />
                <line x1="3" y1="15" x2="17" y2="15" />
            </svg>
            <span>Jersey Bidding</span>
          </Link>
        </li>
        <li className="hover:translate-x-1">
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
  )
}
  /*  const menus = [
      { name: "Profile", link: "/profile", icon: MdOutlineDashboard },
      { name: "Instructions", link: "/dashboard/instructions", icon: AiOutlineUser },
      { name: "Room Bidding", link: "/roomBidding", icon: FiMessageSquare },
      { name: "Logout", link: "/", icon: TbReportAnalytics, margin: true },
      { name: "File Manager", link: "/", icon: FiFolder },
      { name: "Cart", link: "/", icon: FiShoppingCart },
      { name: "Saved", link: "/", icon: AiOutlineHeart, margin: true },
      { name: "Setting", link: "/", icon: RiSettings4Line },
    ]; 


const menus = [
  { name: "Profile", link: "/profile", icon: MdOutlineDashboard },
  { name: "Instructions", link: "/dashboard/instructions", icon: AiOutlineUser },
  { name: "Room Bidding", link: "/roomBidding", icon: FiMessageSquare },
  { name: "Logout", link: "/", icon: TbReportAnalytics, margin: true },
];

    console.log(open)

   return (
      <section className={`absolute ${ open ? "w-full lg:w-48" : "hidden"}  flex gap-6`}>
        <div
          className={`bg-[#0e0e0e] min-h-screen duration-1000 text-gray-100 px-4`}>
          
          <div className="mt-4 flex flex-col gap-4 relative">
            {menus?.map((menu, i) => (
              <>
                <h2
                  style={{
                    transitionDelay: `${i }00ms`,
                  }}
                  className={`whitespace-pre duration-500 ${
                    !open && "opacity-0 translate-x-28 overflow-hidden"
                  }`}
                >
                  {menu?.name}
                </h2>
                <h2
                  className={`${
                    open && "hidden"
                  } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
                >
                  {menu?.name}
                </h2>
                </>
            ))}
          </div>
        </div>
    </section>
  )
}*/

