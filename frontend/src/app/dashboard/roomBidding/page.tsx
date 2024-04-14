"use client"

import React from 'react'
import { CircularProgress } from '@mui/material';
import {useEffect, useState} from "react";
import eusoffLogo from "public/eusoff-logo.png";
import { HiMenuAlt3 } from "react-icons/hi";

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
}

const axios = require('axios');

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface RoomDialogProps {
  dialogOpen: boolean;
  // handleDialogOpen: () => void;
  handleDialogClose: () => void;
  roomContent: Room;
}

const RoomBidding: React.FC = () => {
  
  const [loading,setLoading] = useState(true);
  const [roomList, setRoomList] = useState<Room []>([]);
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [roomSelect, setRoomSelect] = useState<Room>(
    {
      block: '',
      number: 0,
      capacity: 0,
      occupancy: 0
    }
  );
  
  const handleDialogOpen = (room : Room) => {
    setDialogOpen(true);
    setRoomSelect(room);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  console.log(roomSelect)

  useEffect(() => {
    console.log('im called')
    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/room/list`)
    .then((response:any)=>{
    if(response.data.success){
        setLoading(!response.data.success)
        setRoomList(response.data.data)
        console.log("im in")
        }
    })
    .catch()

   /* axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/room/info`)
    .then((response:any)=>{
    if(response.data.success){
        setLoading(!response.data.success)
        setPoints(sortPoints(response.data.data))
        }
    })
    .catch() */
}, [])  



  return ( loading ? (
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
              Points : 100
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
                  {`Capacity: ${roomSelect.capacity}`}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDialogClose}>Close</Button>
              </DialogActions>
            </Dialog>
          </React.Fragment>

          {/*Placeholder image and log in text*/}
          <div className=" bg-slate-200 text-center">
            <h1 className="text-black">
            Available Rooms 
            </h1>
            
          <div className="flex flexCol">
            {
              roomList!==null && roomList.map((room,index)=>{
                const block = room.block;
                const number = room.number;
                const capacity = room.capacity;

                return (
                  <div
                  key={index}
                  className="bg-gray-800 h-16 w-16 m-2 flex items-center justify-center text-white font-semibold text-xl cursor-pointer hover:bg-gray-500"
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