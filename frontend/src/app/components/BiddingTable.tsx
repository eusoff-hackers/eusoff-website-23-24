import React, { useEffect } from 'react';
import { Bidding } from '../dashboard/page';
import { ToastMessage } from '../dashboard/page';

interface BiddingList {
  biddings: Bidding[];
  setBiddings: React.Dispatch<React.SetStateAction<Bidding[]>>;
  updateUser: () => void;
  setToast: React.Dispatch<React.SetStateAction<ToastMessage>>;
  handleOpen: () => void;
}

const axios = require('axios'); 
const axiosWithCredentials = axios.create({
  withCredentials: true,
});

const BiddingTable : React.FC<BiddingList> = ({ biddings, setBiddings, updateUser, setToast, handleOpen}) => {

  const deleteBid = (ind : number) => {
    const filteredList = biddings.filter(bidding => bidding.number != biddings[ind].number)
    setBiddings(filteredList)
  }

  // Currently unable to make the api call
  const handleSubmit = async (e : React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    try {
     
      const response = await axiosWithCredentials.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bid/create`, {
        bids: biddings
      });

      if (response.data.success) {
        console.log('Successful bids')
        setToast({ message:"Bids submitted", severity:"success"})
        handleOpen()
        updateUser()
      } else {
        console.error('Bids failed');
        setToast({ message:"Bids failed to be submitted", severity:"error"})
        handleOpen()
      }
    } catch (error) {
      console.error('Error during form submission', error);
    }
  };


  return (
    <div>
      <div className="flex items-center space-x-4 pb-2">
        <h2 className="text-xl font-semibold py-2">Here are the list of your biddings:</h2>
        { biddings.length == 0 ? <></> : 
        <button
          type="submit"
          className="bg-blue-500 text-white px-2 py-2 rounded hover:bg-blue-600 focus:outline-none"
          onClick={e => handleSubmit(e)}
        >
          Submit
        </button>}
      </div>
      <table className="min-w-full bg-white divide-y divide-gray-200">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider">
              Ranking
            </th>
            <th className="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider">
              Jersey Number
            </th>
            <th className="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-gray-50">
          {biddings.map((bidding, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="px-6 py-4 whitespace-no-wrap">
                {index + 1}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap">
                {bidding.number}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap">
                <button 
                  className="text-red-500 bg-red-100 hover:bg-red-200 px-3 py-1 rounded focus:outline-none"
                  onClick={() => deleteBid(index)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BiddingTable;