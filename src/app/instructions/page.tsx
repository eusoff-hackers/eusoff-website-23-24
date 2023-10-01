"use client"; // This is a client component 👈🏽

import Link from 'next/link'

import { useSelector } from 'react-redux'
import { removeUser, selectUser, User } from '../redux/Resources/userSlice';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';

const InstructionsPage = () => {
  const route = useRouter();

  const dispatch = useDispatch();

  const logout = () => {
    dispatch(removeUser());
    route.push('/');
  }

  return (
    <div className="bg-gradient-to-tl from-slate-300 to-slate-200 h-full w-full flex flex-col lg:flex-row">

      {/* nav bar here*/}
      <nav className="w-full lg:w-64 bg-gray-800 text-white p-5">
        <h1 className="text-2xl mb-5">Dashboard</h1>
        <ul className="space-y-2">
          <li>
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
          <li>
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
          <li>
            <Link className="flex items-center gap-3 py-2" href="/instructions">
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
              <span>Instructions</span>
            </Link>
          </li>
          <li>
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

      <main className="bg-gradient-to-tl from-slate-300 to-slate-200 h-fit w-full">
        <article className="bg-slate-200 shadow-2xl py-5 p-2 border-4 lg:rounded-r-lg lg:rounded-bl-none rounded-b-lg  border-slate-800">

          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6 stroke-red-400 m-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <h1 className="text-black md:text-3xl text-2xl font-black px-2 font-mono inline">
            Instructions
          </h1>

          <div className="text-black md:text-xl text-base px-2 py-1 font-mono leading-normal">
            1. There will be a total of 4 rounds (<strong>take note: if you made the IHG cut of any sport last AY regardless of whether IHG happened for your sport, it would be considered as 1 IHG played</strong>)

            <ol className="list-outside list-disc ml-8">
            <br />
              <li><strong>Round 1</strong>: For those who have played at least <strong>3 IHG </strong></li>

              <li><strong>Round 2</strong>: For those who have played at least <strong>2 IHG</strong> </li>

              <li><strong>Round 3</strong>: For those who have played at least <strong>1 IHG</strong> </li>

              <li><strong>Round 4</strong>: For those who have <strong>not played</strong> IHG at all </li>
            </ol>
            <br />
            2. Bidding points are calculated as follows:
            <ol className="list-outside list-disc ml-8">
            <br />
              <li>Captain points = 1 point</li>

              <li>Made it through the 1st cut = 1 point (each sport)</li>

              <li>Made it through final cut last year = 1 point (each sport)</li>
            </ol>
            <br />
            <p>3. Eusoffians are to bid during their round ONLY. </p>
            <br />

            <p>4. Eusoffians are to enter the website using the given username and password and submit their top 5 numbers.</p>
            <br />
            
            <ul className="underline font-bold ">Rounds:</ul>
            <ul className="list-outside list-disc ml-8 space-y-2">

              <li>Numbers in Round 1 will <strong>not</strong> be shared. Only 1 person of each gender can get a specific number. Numbers from 1-9 will <strong>not</strong> be shared as well. </li>

              <li>Numbers taken in earlier rounds will be closed and Eusoffians bidding in subsequent rounds will not be able to bid for them (eg. if the number 10 is selected in Round 1, it will no longer be available in Round 2 and after).</li>

              <li>Eusoffians who bid after Round 1 will have to share numbers if more than 1 person bids for the same number. Numbers can be shared by up to 3 people per gender. </li>

              <li>If numbers in Round 4 are insufficient, numbers in Round 3 will be made available for bidding and shared (the aforementioned limit on sharing still applies).</li>
            </ul>
            <br />


            <ul className="underline font-bold">Bidding:</ul>
            <ol className="list-outside list-disc ml-8 space-y-2">
              <li>The most recent bid submission before the round closes will be considered final</li>

              <li>Allocation of numbers is <strong>not</strong> based on a first come first serve basis. Numbers will be allocated after each round based on your ranking of the numbers and if you have points/senior priority.</li>

              <li>You will be able to see the number of people who are bidding for each number, as well as the number's availability</li>

              <li>For each sport, you will be able to see the numbers bidded for by the rest of the people in the team (each person is identified only through their room number due to PDPA)</li>

              <li>In the event that Eusoffians with the same bidding points bid for the same number, priority will be given to senior Eusoffians. If not, the top choice number will be given to a random person in the conflicting group. (If Tom, Jerry, and Moose put "20" as their top choice, the senior will get the number. But if all are of equal seniority the system will randomly select one of the 3 persons. The others will be given their next highest choices if possible) </li>

              <li>There will be no sharing of numbers in the team sports below</li>
            
            
              <ol className = "indent-4 list-outside ml-4">
                  <li>a. Basketball (Male, Female) </li>

                  <li>b. Floorball (Male, Female) </li>

                  <li>c. Frisbee (Mixed) </li>

                  <li>d. Handball (Male, Female) </li>

                  <li>e. Soccer (Male, Female) </li>

                  <li>f. Softball (Mixed) </li>

                  <li>g. Touch Rugby (Male, Female) </li>

                  <li>h. Volleyball (Male, Female) </li>
              </ol>
            </ol>
          </div>
          
        </article>
      </main>
    </div>
  )
}

export default InstructionsPage;
