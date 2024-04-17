"use client"

import React from 'react'
import { CircularProgress } from '@mui/material';
import {useEffect, useState} from "react";
import eusoffLogo from "public/eusoff-logo.png";
import { HiMenuAlt3 } from "react-icons/hi";
import { useSelector } from 'react-redux';
import { removeUser, selectUser, User, setUser } from '../../redux/Resources/userSlice';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { RoomInfoType } from '../profile/page';
import { AxiosError } from 'axios';

// Room Dialog Imports 
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

export interface Room {
  block: string;
  number: number;
  capacity: number;
  occupancy: number;
  allowedGenders: string[];
}

export interface RoomBlock {
  block: string;
  quota: number;
  bidderCount: number;
}

const axios = require('axios');

const hallBlocks = ['A', 'B', 'C', 'D', 'E']

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const RoomBidding: React.FC = () => {
  const user = useSelector(selectUser);
  const route = useRouter();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [roomList, setRoomList] = useState<Room []>([]);
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [blockfilter, setBlockFilter] = useState<string>('A');
  const [userInfo, setUserInfo] = useState<RoomInfoType>();
  const [blockData, setBlockData] = useState<RoomBlock>(
    {
      block: '',
      quota: 0,
      bidderCount: 0,
    })
  const [roomSelect, setRoomSelect] = useState<Room>(
    {
      block: '',
      number: 0,
      capacity: 0,
      occupancy: 0,
      allowedGenders: [''],
    }
  );
  
  const handleDialogOpen = (room : Room) => {
    setDialogOpen(true);
    setRoomSelect(room);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleBlockFilter = (block: string) => {
    setBlockFilter(block);
  }

  useEffect(() => {
    console.log('im called')
    fetchRoomBidInfo()
    fetchRoooms()
   /* axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/room/info`)
    .then((response:any)=>{
    if(response.data.success){
        setLoading(!response.data.success)
        setPoints(sortPoints(response.data.data))
        }
    })
    .catch() */
}, [])

  // api call to fetch all rooms
  const fetchRoooms = async () => {
    await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/room/list`)
    .then((response:any)=>{
    if(response.data.success){
        setLoading(!response.data.success)
        setBlockData(response.data.data.blocks)
        setRoomList(response.data.data.rooms)
        }
    })
    .catch()
  }
  
  // api call to fetch user's room bidding info (duplicate call in profile page, can be refactored to be more efficient)
  const fetchRoomBidInfo = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/room/info`);

      if (response.data.success) {
       // console.log("This is eligible bids info " + JSON.stringify(response.data.data))

        const roomBidInfo: RoomInfoType = {
          isEligible: response.data.data.info.isEligible,
          points: response.data.data.info.points,
          canBid: response.data.data.info.canBid,
          bids: response.data.data.bids
        }
        setUserInfo(roomBidInfo)
        setUserLoading(!response.data.success)

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

  return ( loading || userLoading ? (
    <div className="flex justify-center items-center h-screen">
        <div className="rounded-full h-20 w-20 bg-violet-800 animate-ping">

        </div>
    </div>
  ) : 
        (
          <div className=" bg-gradient-to-tl from-slate-200 to-slate-300 min-h-screen flex flex-col lg:flex-row">
             
      <main className=" h-full w-full ">

          {/*Main Content */}
          <div className=" flex flex-row w-full bg-gradient-to-r from-[#80fbff] to-[#9089fc] opacity-100 font-mono m-0 p-2 font-bold uppercase hover:shadow-2xl">

          <div className="w-6/12 text-gray-900 text-2xl text-left">
                        Eusoff Room Bidding 
          </div>
          <div className="w-6/12 text-gray-900 text- base text-right"> 
              Current Bid : {userInfo.bids[0].room.block}{userInfo.bids[0].room.number}
          </div>
          <div className="w-6/12 text-gray-900 text- base text-right"> 
              Points : {userInfo.points}
          </div>
        </div>
        {/*Top Banner
        bg-gradient-to-r from-[#25AE8D] to-[#008087]
          bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30
        */}
    

        {/*Main Content*/}
        <div className="bg-slate-200 mt-10 w-5/6 shadow-2xl text-3xl font-mono rounded-lg divide-y-5 m-auto grid grid-flow-row md:grid-flow-col gap-0 md:items-center py-10 px-5 mb-3">

          {/*Dialog Box*/}
          <React.Fragment>
            <Dialog
              open={dialogOpen}
              TransitionComponent={Transition}
              keepMounted
              onClose={handleDialogClose}
            >
              <DialogTitle>{`Room Number:  ${roomSelect.block}${roomSelect.number}`}</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  {roomSelect.capacity == 1 ? "Room Type: Single Room" : "Room Type: Double Room"}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDialogClose}>Close</Button>
              </DialogActions>
            </Dialog>
          </React.Fragment>

          {/*Placeholder image and log in text*/}
          <div className=" bg-slate-200 text-center">
            <h1 className="text-black border-b-2 border-b-slate-400">
            Available Rooms 
            </h1>

            
          <div className='flex flex-row justify-center items-center'>
            <p>Select Block:</p>
              {
                hallBlocks.map((block,index)=>{
                  return (
                    <div
                    key={index}
                    className={` h-10 w-10 m-2 flex items-center justify-center text-white font-semibold text-xl cursor-pointer hover:bg-gray-500 rounded-lg
                    ${blockfilter === block ? 'bg-blue-500' : 'bg-gray-800'}`}
                    onClick={() => handleBlockFilter(block)}
                    >
                        {block}
                    </div>
                  )
                })
              }
          </div>
          <div className="flex flexCol">
            {
              roomList!==null && 
              roomList.filter(
                (room) => (room.block == blockfilter && room.allowedGenders[0] == user.gender) // checks if block selected and gender same as user
              ).map((room,index)=>{
                const block = room.block;
                const number = room.number;
                const capacity = room.capacity;

                return (
                  <div
                  key={index}
                  className={`bg-gray-800 h-16 w-16 m-2 flex items-center justify-center text-white font-semibold text-xl cursor-pointer hover:bg-gray-500`}
                  onClick={() => {
                    handleDialogOpen(room);
                  }}
                  >
                       {block}{number}
                  </div>
                )
              })
            }
            </div>
          </div>
        </div>

        </main>
        
    </div>
        )
    )
}

export default RoomBidding