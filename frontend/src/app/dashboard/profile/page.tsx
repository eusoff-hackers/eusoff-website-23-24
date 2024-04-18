"use client"; // This is a client component 👈🏽 

import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { removeUser, selectUser, User, setUser } from '../../redux/Resources/userSlice';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import NavBar from '../../components/NavBar';
import Loading from '../../components/Loading';
import { ProfileTableItems } from '@/app/components/Profile/ProfileTable';
import ProfileTable from '@/app/components/Profile/ProfileTable';
import { AxiosError } from 'axios';


const axios = require('axios');
const axiosWithCredentials = axios.create({
  withCredentials: true,
});

export interface RoomInfoType {
  isEligible: boolean;
  points: number;
  canBid: boolean;
  bids: RoomType[];
}

export interface RoomType {
  room: {
    block: string;
    number: number;
    capacity: number;
    occupancy: number;
    allowedGenders: string[];
  }
}

const ProfilePage = () => {
  // retrieve user data
  const user = useSelector(selectUser);
  const route = useRouter();
  const dispatch = useDispatch();

  const [isClient, setIsClient] = useState(false);
  const [userInfo, setUserInfo] = useState<ProfileTableItems[]>([]);
  const [roomBidInfo, setRoomBidInfo] = useState<RoomInfoType>();
  const [ccaInfo, setCcaInfo] = useState<ProfileTableItems[]>([]);

  useEffect(() => {
    if (user == null) {
      route.push('/');
      return;
    }
    setIsClient(true);
    fetchRoomBidInfo();
    getUserInfo();
  }, [user, route]);

  // api call to fetch user's room bidding points, eligibility
  const fetchRoomBidInfo = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/room/info`);

      if (response.data.success) {
        console.log("This is eligible bids info " + JSON.stringify(response.data.data))

        // set user general room bid info
        const roomBidInfo: RoomInfoType = {
          isEligible: response.data.data.info.isEligible,
          points: response.data.data.info.points,
          canBid: response.data.data.info.canBid,
          bids: response.data.data.bids
        }
        setRoomBidInfo(roomBidInfo)

        // set user cca points info
        const ccaData = response.data.data.info.pointsDistribution;
        const ccaInfoTemp : ProfileTableItems[] = [];
        ccaData.forEach((element: any) => {
            ccaInfoTemp.push({ title: element.cca, value: element.points });
        })
        setCcaInfo(ccaInfoTemp);

      } else {
        console.log({ message: 'Failed to fetch data' });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;

        if(axiosError.response.status == 401) {
          console.error('Session Expired'); 
          dispatch(setUser(null));
          route.push('/');
        }
      }
      console.error('Error during fetching data', error);
    }
  }

  const getUserInfo = () => {
    const userData: ProfileTableItems[] = [
      { title: "Username", value: user.username },
      { title: "Year", value: `${user.year}` }
    ];
    setUserInfo(userData);
  }

  console.log(roomBidInfo)

  return (
    !isClient || user == null ? <Loading /> : 
    <div className="bg-gradient-to-tl from-slate-200 to-slate-300 min-h-screen w-full flex flex-col lg:flex-row">
      <main className="h-fit w-full">
        
        {/*Top Banner*/}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-4xl text-zinc-950
                        font-mono m-0 p-2 font-bold uppercase hover:shadow-2xl text-center">
          Profile
        </div>

        {/*Main Content*/}
        <div className="flex flex-col items-center justify-center">
          <div className="bg-slate-200 mt-10 w-5/6 shadow-2xl text-3xl font-mono rounded-lg divide-y-5
                        m-auto grid grid-flow-row md:grid-flow-col gap-0 md:items-center py-10 px-5 mb-3">

            {/*Placeholder image and log in text*/}
            <div className=" bg-slate-200 text-center">
              <img className="border-dashed w-48 h-48 rounded-full border-4 border-indigo-950 m-auto shadow-2xl shadow-sky-200" 
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" />
              <br/>
              <h1 className="text-black">
                logged in as <br /> <b>{user.username}</b>
              </h1>
            </div>

            {/*Table displaying user data*/}
            <ProfileTable tabledata={userInfo}/>
          </div>
            
          {/*Room Bidding*/}
          <div className=" bg-slate-200 text-center w-5/6 shadow-2xl text-gray-800">
            <h1 className='text-3xl'>Room Bidding</h1>
            { roomBidInfo == null ? <p>Loading...</p> 
            : <ul>
                <li>{`Total Bidding points: ${roomBidInfo.points}`}</li>
                <li>{`Qualified to stay: ${roomBidInfo.isEligible ? `Yes` : `No`} `}</li>
                {/* <li>{`Can bid: ${roomBidInfo.canBid}`}</li> */}
              </ul>
            }
            <div className="py-5 px-5">
              <h1 className="text-2xl">CCA Points Distribution</h1>
              <ProfileTable tabledata={ccaInfo}/>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProfilePage;
