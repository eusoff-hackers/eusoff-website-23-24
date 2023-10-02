"use client"; // This is a client component 👈🏽

import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectUser} from '../redux/Resources/userSlice';
import { useRouter } from 'next/navigation';
import { Alert, Snackbar } from '@mui/material';
import { SnackbarOrigin } from '@mui/material/Snackbar';
 
import Modal from '../components/Modal/modal';
import BiddingTable from '../components/BiddingTable';
import NavBar from '../components/NavBar';

// Create an instance of axios with credentials 
const axios = require('axios');
const axiosWithCredentials = axios.create({
  withCredentials: true,
});

export interface Bidding {
  jersey: {
    number: number
  }
}

interface State extends SnackbarOrigin {
  open: boolean;
}

//function to load saved biddings from localstorage
const loadBiddings = () => {
  try {
      if (typeof window === `undefined`) return [];
      const savedUserBiddings = localStorage.getItem('user_biddings');

      if (!savedUserBiddings) return [];

      const item = JSON.parse(savedUserBiddings);
      return item
  } catch (err) {
    console.error(err);
    return [];
  }
};

const Dashboard: React.FC = () => {
  const user = useSelector(selectUser);
  const route = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

  const userBiddings : Bidding[] = loadBiddings()
  const [biddings, setBiddings] = useState<Bidding[]>(userBiddings);

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

  // Saves changes to user_biddings in local storage
  useEffect(() => {
    localStorage.setItem('user_biddings', JSON.stringify(biddings))
  }, [biddings])

  const openModal = (index: number) => {
    setSelectedItemIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItemIndex(null);
    setIsModalOpen(false);
  };

  //redirects user to home page if not logged in
  // useEffect(() => {
  //   const getUserInfo = async () => {
  //     return await axiosWithCredentials
  //       .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/info`)
  //       .then(res => console.log(res.data.data)).catch(e => console.error(e));
  //   }
    
  //   const response = getUserInfo();
  // });

  useEffect(() => {
    if (user == null) {
      route.push('/');
    }
  }, [user, route]);

  return (
    user == null ? <div>Loading...</div> : 
    <div className="h-screen w-full flex flex-col lg:flex-row">
      <NavBar/>
      <main className="flex-1 p-5 light:bg-white-800 text-black">
        <h2 className="text-xl mb-5">Hello, {user.username}</h2>
        <BiddingTable biddings={biddings} setBiddings={setBiddings}/>
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
      {Array.from({ length: 100 }, (_, index) => (
                <div
                  key={index}
                  className="bg-gray-800 h-16 w-16 flex items-center justify-center text-white font-semibold text-xl"
                  onClick = {() => openModal(index+1)}
                >
                       {index + 1}
                </div>
        ))}

         {isModalOpen && selectedItemIndex !== null && (
        <Modal closeModal={closeModal} index={selectedItemIndex} biddings={biddings} setBiddings={setBiddings} 
          setError={setError}
          handleOpen={handleOpen}
          />
      )}

        </div>
      </main>
    </div>
  )
}

export default Dashboard;
