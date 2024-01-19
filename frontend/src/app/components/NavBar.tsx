"use client";

import React from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { removeUser } from "../redux/Resources/userSlice";
import { useRouter } from "next/navigation";

const axios = require("axios");
axios.defaults.withCredentials = true;

export default function NavBar() {
  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/logout`
      );
    } catch (error) {
      console.error("Logout error");
    }
  };

  const route = useRouter();
  const dispatch = useDispatch();

  const logout = () => {
    dispatch(removeUser());
    localStorage.clear();
    handleLogout();
    route.push("/");
  };

  return (
    <div>
      <nav className="h-full w-full sticky top-0 lg:w-64 bg-gray-800 text-white p-5">
        <p className="text-2xl mb-5">Dashboard</p>
        <ul className="space-y-2">
          <li className="hover:translate-x-1">
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
          <li className="hover:translate-x-1">
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
          <li className="hover:translate-x-1">
            <Link className="flex items-center gap-3 py-2" href="/instructions">
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
              <span>Instructions</span>
            </Link>
          </li>
          <li className="hover:translate-x-1">
            <Link className="flex items-center gap-3 py-2" href="/cca">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
              <span>CCA</span>
            </Link>
          </li>
          <li className="hover:translate-x-1">
            <Link
              className="flex items-center gap-3 py-2"
              onClick={logout}
              href="/"
            >
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
    </div>
  );
}
