import Image from 'next/image'
import type { NextPage } from 'next'
import RootLayout from '../layout'

interface user_data {
  userData: {
    name: string,
    points: number,
    bids: number
  }
}

const ProfilePage: NextPage<user_data> = ({userData}) => {
  // retrieve user data
  if ((userData) === undefined) {
    userData = {name: "Placeholder", points: -1, bids: -1}
  }

  return (
    <main className="bg-gradient-to-tl from-slate-200 to-slate-300 min-h-screen w-full">
      <div className="bg-gradient-to-r  from-cyan-500 to-blue-500 text-4xl text-zinc-950
                       font-mono  text-center m-0 p-2 font-bold uppercase hover:shadow-2xl">
        Profile
      </div>
      <div className="bg-slate-200 mt-10 md:w-3/5 w-5/6 shadow-2xl text-3xl font-mono rounded-lg object-center  text-center
                      sm  m-auto py-20 border-0 border-slate-900">
        <img className="border-dashed w-48 h-48 bg-center rounded-lg border-4 border-indigo-950 m-auto hover:shadow-2xl" 
        src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" />
        <h1 className="text-black">
          logged in as <br /> <b>{userData.name}</b>
        </h1>
        <br />
        <h2 className="text-green-500 font-bold hover:text-green-600" > 
          <b className="font-light">Points</b> 
          <br /> 
          {userData.points}
        </h2>
        <br />
        <h2 className="text-orange-500 font-bold hover:text-orange-600">
          <b className="font-light">Bids</b> 
          <br />
          {userData.bids} 
        </h2>
      </div>
    </main>
  )
}

export default ProfilePage;
