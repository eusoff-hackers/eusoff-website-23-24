"use client"; // This is a client component 👈🏽

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser, setUser, User } from '../redux/Resources/userSlice';
import { useRouter } from 'next/navigation';
import { Alert, Snackbar } from '@mui/material';
 
import Modal from '../components/Modal/modal';
import BiddingTable from '../components/BiddingTable';
import NavBar from '../components/NavBar';


export interface Bidding {
  number: number
}

//function to load saved biddings from localstorage
const loadBiddings = () => {
  try {
      if (typeof window === `undefined`) return [];
      let savedUserBiddings = localStorage.getItem('user_biddings');
      
      if (!savedUserBiddings) return [];
    
      const item = JSON.parse(savedUserBiddings);
      return item
  } catch (err) {
    console.error(err);
    return [];
  }
};

// Create an instance of axios with credentials 
const axios = require('axios'); 
axios.defaults.withCredentials = true;

const Dashboard: React.FC = () => {
  const user = useSelector(selectUser);
  const route = useRouter();
  const dispatch = useDispatch();

  // Check if there is better fix for this.
  const [isNav, setIsNav] = useState(false);
  
  const [isClient, setIsClient] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

  const userBiddings : Bidding[] = []
  const [biddings, setBiddings] = useState<Bidding[]>(userBiddings);
  const [allowedBids, setAllowedBids] = useState<number[]>([])

  const [error, setError] = useState('');

  //state for the Snackbar component
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setError('')
  };

  // Does a call for elligible bids. API stil WIP
  const getEligibleBids = async () => { 
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jersey/eligible`);

      if (response.data.success) {
        setAllowedBids(response.data.data.jerseys)
      }
      
    } catch (error) {
      console.error('Error during getting allowed bids', error);
    }
  }

  // Updates information on the page after 
  const updateUser = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/info`);

      if (response.data.success) {
        const newUser : User = {
          username: response.data.data.user.username,
          teams: response.data.data.user.teams,
          bids: response.data.data.user.bids,
          isEligible: response.data.data.user.isElligible,
          role: response.data.data.user.role,
          year: response.data.data.user.year,
          points: response.data.data.user.points
        }
        console.log("updated user")
        dispatch(setUser(newUser));
      }
    } catch (error) {
      console.error('Error during update', error);
    }
  }

  // set biddings to the biddings the user has previously made
  const setPreviousBids = () => {
    user != null ? setBiddings(JSON.parse("["+String(user.bids.map(item => `\{\"number\":${item.jersey.number}\}`))+"]")) : false;
  }

  // Saves changes to user_biddings in local storage
  useEffect(() => {
    localStorage.setItem('user_biddings', JSON.stringify(biddings))
  }, [biddings])

  useEffect(() => {
    setIsNav(true);
    setIsClient(true); // indicate that client has been rendered
    getEligibleBids(); // get all eligible bids when page renders
    setPreviousBids(); // set bids in bidding table when page renders
  }, [])

  //If not authorised, then redirects the user
  useEffect(() => {
    if (user == null) {
        route.push('/');
    }
  }, [user, route]);

  const openModal = (index: number) => {
    setSelectedItemIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItemIndex(null);
    setIsModalOpen(false);
  };



  return (
    !isClient || user == null ? (<div>Loading...</div>) : 
    (<div className="h-screen w-full flex flex-col lg:flex-row">
      { isNav && <NavBar/>}
      <div className="flex-1 p-5 light:bg-white-800 text-black">
        <h2 className="text-xl mb-5">Hello, {user.username}</h2>

        { biddings.length>0 && <BiddingTable biddings={biddings} setBiddings={setBiddings} updateUser={updateUser}/> }
        <div>
          {error == '' 
            ? <></> 
            : <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                  {error}
                </Alert>
              </Snackbar>
          }
        </div>
        <div className="grid pt-4 pl-7 grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-4 gap-y-5 mt-5">
          {Array.from({ length: 100 }, (_, index) => ( allowedBids.includes(index + 1) ? 
              (<div
                key={index}
                className= {`${user.bids.filter(item => item.jersey.number === index + 1).length === 1 
                            ? "bg-green-400" 
                            : "bg-gray-800"} 
                            h-16 w-16 flex items-center justify-center text-white font-semibold text-xl cursor-pointer hover:bg-gray-500`} 
                onClick = {() => openModal(index+1)}
              >
                     {index + 1}
              </div>) :             (<div
                key={index}
                className="bg-red-500 h-16 w-16 flex items-center justify-center text-white font-semibold text-xl"
                onClick = {() => null}
              >
                      {index + 1}
              </div>)
        ))}

         {isModalOpen && selectedItemIndex !== null && (
        <Modal closeModal={closeModal} index={selectedItemIndex} points={user.points} biddings={biddings} setBiddings={setBiddings} 

          setError={setError}
          handleOpen={handleOpen}
          />
        )}

        </div>
      </div>
    </div>)
  )
}

export default Dashboard;
