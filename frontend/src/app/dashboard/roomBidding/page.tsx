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
import { RoomInfoType, RoomType } from '../profile/page';
import { AxiosError } from 'axios';
import LeaderboardDialog from '../../components/LeaderboardDialog'

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
  _id: string;
  block: string;
  number: number;
  capacity: number;
  occupancy: number;
  allowedGenders: string[];
  bidders: bidderInfo[];
}

export interface bidderInfo {
  user: {
      username: string;
      role: string;
      year: number;
      gender: string;
      room: string;
  },
  info: {
      isEligible: boolean;
      points: number;
  }
}

export interface BlockInfo{
  quota: number;
  bidderCount: number ;
}

export interface RoomBlock {
  block: string;
  quota: number;
  bidderCount: number;
}

export interface RoomDet {
  block: string;
  number: number;
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
  const [unsaved,setUnsaved] = useState<boolean> (false);
  const [blockData, setBlockData] = useState<Record<string, BlockInfo>>({});
  const [roomSelect, setRoomSelect] = useState<Room>(
    {
      _id: '',
      block: '',
      number: 0,
      capacity: 0,
      occupancy: 0,
      allowedGenders: [''],
      bidders: []
    }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currentBid,setCurrentBid] = useState<RoomDet>({block:'',number: 0})
  
  const objectify = (array: RoomBlock[]): Record<string, BlockInfo> => {
    const object: Record<string, BlockInfo> = {};
    array.forEach((item) => {
      object[item.block] = { quota: item.quota, bidderCount: item.bidderCount };
    });
    return object;
  }

    const createLeaderboard = (block: string) => {
      // Filter rooms by block and flatMap to get an array of all bidders in that block
      const getAllBiddersForBlock:bidderInfo[] = roomList
        .filter(room => room.block === block)
        .flatMap(room => room.bidders);
    
      // Sort bidders by points in descending order
      const sortedBidders:bidderInfo[] = getAllBiddersForBlock.sort((a:any ,b:any) => b.info.points - a.info.points);

      return sortedBidders;
    }


  const handleDialogOpen = (room : Room) => {
    setDialogOpen(true);
    setRoomSelect(room);
  };

  const handleDialogClose = () => {
    if (!isSubmitting) {
      setDialogOpen(false);
    }
  };

  const handleBlockFilter = (block: string) => {
    setBlockFilter(block);
  }


  const handleBidAcceptance = (roomSelect:Room) => {
    if(userInfo.bids[0]==null && userInfo.canBid){
      const newRoom: RoomType = {
        room: {
          block: roomSelect.block,
          number: roomSelect.number,
          capacity: roomSelect.capacity,
          occupancy: roomSelect.occupancy,
          allowedGenders: roomSelect.allowedGenders,
        }
      };

      setUserInfo({
        ...userInfo,
        bids: [newRoom] // Adding the new room
      });

    } else {
      console.log(userInfo)
      userInfo.bids[0].room.block = roomSelect.block;
      userInfo.bids[0].room.number = roomSelect.number;
    }
    setIsSubmitting(true);
    submitBid();
    setIsSubmitting(false);
    setDialogOpen(false);
  }

  useEffect(() => {
    fetchRoomBidInfo()
    fetchRooms()

    const interval = setInterval(() => {
      fetchRoomBidInfo();
      fetchRooms();
    }, 5000);

    return () => clearInterval(interval);
  }, [])


  // api call to make room bidding submission
  const submitBid = async () => {
    await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/room/bid`, {
      rooms: [{ _id: roomSelect._id }]
    })
    .then((response:any)=>{
    if(response.data.success) {
        console.log("Bid Submitted")
    }
    })
    .catch()
  }

  // api call to fetch all rooms
  const fetchRooms = async () => {
    await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/room/list`)
    .then((response:any)=>{
    if(response.data.success){
        setLoading(!response.data.success)
        setBlockData(objectify(response.data.data.blocks))
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
        //console.log("This is eligible bids info " + JSON.stringify(response.data.data))

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

          {/*Top Banner */}
          <div className=" flex flex-row w-full bg-gradient-to-r from-[#80fbff] to-[#9089fc] opacity-100 font-mono m-0 p-2 font-bold uppercase hover:shadow-2xl">

          <div className=" text-gray-900 text-2xl text-left">
                        Eusoff Room Bidding 
          </div>
         
        </div>
        {/*Top Banner Alternative Color Scheme
        bg-gradient-to-r from-[#25AE8D] to-[#008087]
          bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30
        */}
    
    <div className="flex flex-col md:flex-row justify-between bg-slate-200 mt-10 w-5/6 shadow-2xl text-xl font-mono rounded-lg divide-y-5
             m-auto py-10 px-5 mb-3">
          <div className="text-gray-900 text-left"> 
            Current Bid: {userInfo.bids[0]?.room ? `${userInfo.bids[0].room.block}${userInfo.bids[0].room.number}` : "No Room Selected"}
          </div>
          <div className="text-gray-900 text-left md:text-right "> 
              Points : {userInfo.points}
          </div>
    </div>

        {/*Main Content*/}
        <div className="flex flex-col bg-slate-200 mt-10 w-5/6 shadow-2xl text-3xl font-mono rounded-lg divide-y-5
         m-auto h-full items-center py-10 px-5 mb-3">

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
                <br/>
                <DialogContentText>
                  <p className='font-bold'>Bidders List:</p>
                </DialogContentText>
                {

                  roomSelect.bidders.length != 0 && 
                    roomSelect.bidders
                    .slice() // Make a shallow copy of the array to prevent mutating the original
                    .sort((a, b) => b.info.points - a.info.points) //
                    .map((bidder,index)=>{
                      
                      return (
                        <DialogContentText key={index}>
                          {`Bidder ${index+1}: ${bidder.user.room} - ${bidder.info.points} points`}
                        </DialogContentText>
                      )
                    })
                }
                <DialogContentText>
                  &nbsp;
                </DialogContentText>
                <DialogContentText>
                  Are you sure you want to choose this room?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
              {
                userInfo.canBid ? (
                  <>
                    <Button  color="success" onClick={()=>{handleBidAcceptance(roomSelect)}}>Accept</Button>
                    <Button  color="error" onClick={handleDialogClose}>Close</Button>
                  </>
                )
                : (<p>Not eligible for bidding</p>)

              }
              </DialogActions>
            </Dialog>
          </React.Fragment>

          <div className="flex flex-col w-full h-full bg-slate-200 text-center">
            <h1 className="text-black border-b-2 border-b-slate-400">
            Available Rooms 
            </h1>

            
          <div className='flex flex-row justify-center items-center'>
            <p className="text-black text-xs lg:text-xl font-mono">Select Block:</p>
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
            <LeaderboardDialog data={createLeaderboard(blockfilter)} />
          </div>
          <div className='flex flex-row justify-center items-center' >
            <p className="text-black text-xs lg:text-xl font-mono"> Block Quota : {blockData[blockfilter].quota} , Bids : {blockData[blockfilter].bidderCount}</p>
          </div>
          <div className="w-full h-full grid grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-4 gap-y-5 mt-5">
            {
              roomList!==null && user!=null &&
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