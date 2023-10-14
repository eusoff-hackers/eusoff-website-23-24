"use client"; // This is a client component 👈🏽

import React, { useState, useEffect } from 'react'
import { removeUser } from '../redux/Resources/userSlice';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import NavBar from '../components/NavBar';

const InstructionsPage = () => {
  const route = useRouter();

  const [isNav, setIsNav] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    setIsNav(true);
  }, [])


  const logout = () => {
    dispatch(removeUser());
    route.push('/');
  }

  return (
    <div className="bg-gradient-to-tl  h-full w-full flex flex-col lg:flex-row">
      { isNav && <NavBar/> }
      <main className="bg-gradient-to-tl h-fit w-full">
        <article className="bg-slate-200 shadow-2xl py-5 p-2 border-4 lg:rounded-r-lg lg:rounded-bl-none rounded-b-lg font-mono border-slate-800">

          {/*-------------General Information-----------*/}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8 stroke-red-400 m-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <h1 className="text-black md:text-3xl text-2xl font-black px-2 inline">
            General Information
          </h1>

          <div className="text-black md:text-xl text-base px-2 py-1 leading-normal">
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
              <li>Captain = 1 point</li>

              <li>Made it through the 1st cut = 1 point (each sport)</li>

              <li>Made it through final cut last year = 1 point (each sport)</li>
            </ol>
            <br />
            <p>3. Eusoffians are to bid during their round only. </p>
            <br />

            <p>4. Eusoffians are to enter the website using the given username and password and submit their top 5 numbers.</p>
            <br />

            <h2 className="underline font-bold">Bidding</h2>
            <ol className="list-outside list-disc ml-8 space-y-2">
              <li>Available numbers and blocked numbers are clearly distinguishable on the website. You can only click on and place bids for numbers that have not hit the quota.</li>

              <li>To help you place your bids more strategically, the website allows you to see the number of people who are bidding for each number, as well as each of their points (each person is identified only through their room number due to PDPA).</li>

              <li>Rank the jersey numbers you wish to bid for, and hit the Submit button. You should see a confirmation message when the system registers your bids.</li>

              <li>If you wish to delete your bids, remember to press Submit as well.</li>
            </ol>

            <br/>
            <h2 className="underline font-bold ">Number Quota</h2>
            <ul className="list-outside list-disc ml-8 space-y-2">

              <li>Since there are more Eusoffians than unique jersey numbers, the numbers will be shared, but only to a certain limit, and with some exceptions. </li>

              <li>#1 - #9 will <strong>not</strong> be shared.</li>

              <li>All numbers in Round 1 will <strong>not</strong> be shared. Only one person of each gender can get a specific number, eg. If Jason (M), Lily (F) and Anna (F) all bid for #17 in Round 1, only Jason and one of Lily or Anna will get it. </li>

              <li>Numbers that are not taken in Round 1, can be shared by up to 3 people per gender. </li>

              <li>However, there will be no sharing of numbers in the team sports below.</li>
              
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
            </ul>

            <br />
            <h2 className="underline font-bold">Allocation of Numbers</h2>
            <ul className="list-outside list-disc ml-8 space-y-2">
              <li>Numbers will be allocated after each round. </li>

              <li>The allocation will be done by a computer script based on: </li>
              <ol className = "indent-4 list-inside list-decimal ml-4">
                  <li>Ranking of the numbers </li>

                  <li>Points </li>

                  <li>Seniority </li>
              </ol>

              <li>In the event of a tie in the above criteria, the top choice number will be given to a <strong>random</strong> person in the conflicting group. For instance, If Tom, Jerry, and Mike #20 as their top choice, the same bidding points, and are all in year 2, the system will randomly select one of the three bidders. The others will be given their next highest choices if possible. </li>

              <li>Allocation of numbers is <strong>not</strong> based on a first come first serve basis. </li>
              
              <li>The allocation will also take into account the aforementioned quota, as well as each bidder&apos;s CCA. </li>

              <li>Once the bids of one round have been processed, numbers that hit the quota will be blocked and inaccessible to Eusoffians who are bidding in subsequent rounds. </li>
            </ul>
          </div>
          <br/>
          {/*-------------General Information-----------*/}

          {/*-------------FAQ-----------*/}
          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-messages stroke-blue-300 w-10 h-10 m-2" width="40" height="40" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M21 14l-3 -3h-7a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1h9a1 1 0 0 1 1 1v10"></path>
            <path d="M14 15v2a1 1 0 0 1 -1 1h-7l-3 3v-10a1 1 0 0 1 1 -1h2"></path>
          </svg>
          <h1 className="text-black md:text-3xl text-2xl font-black px-2 font-mono inline">
            FAQs
          </h1>
          <div className="text-black md:text-xl text-base font-bold px-2 py-1 font-mono leading-normal">
            1. I&apos;m having some issues with the website, what should I do?
            <ul className="list-disc list-outside font-normal ml-8 space-y-2">
              <li>You can contact any of the Eusoff Hackers members, and we will assist you to the best of our abilities. Please share as much details as you can, like what you see on your screen, how you ran into the issue, etc.</li>
            </ul>
            <br />
            
            2. I did not get the number I wanted. Can I try again in later rounds?
            <ul className="list-disc list-outside font-normal ml-8 space-y-2">
              <li>No. </li>
            </ul>
            <br />

            3. What happens if I don&apos;t bid for a number?
            <ul className="list-disc list-outside font-normal ml-8 space-y-2">
              <li>You will be randomly assigned one of the remaining available numbers after Round 4.</li>
            </ul>
            <br />

            4. I don&apos;t quite get how the quota will apply to CCAs.
            <ul className="list-disc list-outside font-normal ml-8 space-y-1">
            <li>Some team sports (listed above) only allow one member to have a certain number. </li>
            <li>Take the following scenario: </li>
              <ol className = "list-outside list-disc ml-8 space-y-1">
                <li>David is in Volleyball (M) and Softball. He bids for #20 and #45, in that order. </li>
                <li>Juan is in Volleyball (M) and Swimming. He bids for #20 and #67. </li>
                <li>Michelle is in Volleyball (F) and Swimming. She bids for #67 and #20. </li>
                <li>Let&apos;s say David is allocated the #20. Juan can no longer get the number because Volleyball (M) does not allow sharing of numbers within the team.</li>
                <li>If Juan successfully gets his second choice #67, Michelle is still able to get her first choice since she can share #67 with Juan.</li>
                <li>If Michelle is unable to get #67, she is still eligible for #20. Even though David already has #20, the “no sharing” rule does not apply across Volleyball (M) and Volleyball (F).</li>
              </ol>
            </ul>
          </div>
          {/*-------------FAQ-----------*/}
        </article>
      </main>
    </div>
  )
}

export default InstructionsPage;
