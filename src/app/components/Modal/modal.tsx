import React, {useState, useEffect} from 'react';
import { Bidding } from '@/app/dashboard/page';

interface ModalProps {
  closeModal: () => void;
  index: number;
  points: number;
  biddings: Bidding[];
  setBiddings: React.Dispatch<React.SetStateAction<Bidding[]>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  handleOpen: () => void;
}

interface User{
  username: string,
  teams: any[],
  points: number,
}

const axios = require('axios'); 
axios.defaults.withCredentials = true;

const Modal: React.FC<ModalProps> = ({ closeModal, index, points, biddings, setBiddings, setError, handleOpen }) => {
  
  const [bidders,setBidders] = useState(null);

    const fetchList:any = async (index: number) => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jersey/info`);
        
        if (response.data.success) {
           console.log(response.data.data[index])
           setBidders(response.data.data[index])
        }
      } catch (error) {
        console.error('Error during update', error);
      }
  }

  useEffect(()=>{
    fetchList(index);
  },[index])


  const createBid = (ind : number) => {    
    const duplicateArr = biddings.filter(bidding => bidding.number == ind);
    
    if (duplicateArr.length !== 0) {
      // Include a popup to tell user to not bid for duplicates
      console.log("Cannot bid for duplicate numbers")
      setError("Cannot bid for duplicate numbers")
      handleOpen()
      return
    }
    
    if (biddings.length > 4) { //number is 4 because when open modal for 5th number, will record 4 numbers in bidding
      // Include a popup to tell user not to bid for more than 5 numbers
      console.log("Cannot bid for more than 5 numbers")
      setError("Cannot bid for more than 5 numbers")
      handleOpen()
      return
    } 

    const newBidding : Bidding = {
        number: ind
    }

    setBiddings([...biddings, newBidding])
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
      <div className="w-96 bg-white p-6 rounded-lg z-10 relative">
        <div className='flex content-between'>
            <h2 className="text-2xl font-semibold py-2 mb-4">Bidding List</h2>
            <button
            className="absolute ml-3 right-2 top-2 text-gray-600 hover:text-red-500 cursor-pointer"
            onClick={closeModal}
            >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
                />
            </svg>
            </button>
        </div>
        { bidders != null && 
        <div className="mb-4">
          {(bidders.Male.length>0 || bidders.Female.length>0) ? (
             <table className="min-w-full border-collapse border border-gray-300">
                <tbody>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2">Category</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Points</th>
                  </tr>
                

                  {Object.keys(bidders).map((category, index:number) => (
                    bidders[category].length > 0 && (
                    <>
                      <tr  key={index}>
                      <td className="px-4 py-2 font-bold">{category}</td>
                      <td className="px-4 py-2"></td>
                      <td className="px-4 py-2"></td>
                      </tr>
                      {bidders[category].map((item:User,subIndex:number) => (
                        <tr className="mx-2" key={subIndex}>
                          <td className="px-4 py-2"></td>
                          <td className="px-4 py-2">{item.username}</td>
                          <td className="px-4 py-2">{item.points}</td>
                        </tr>
                      ))}
                  </>
                  )
                  ))}
                </tbody>
              </table>
           ) : (
            <p> No Bids Found!!!</p>
           )
          }
        </div>
        }
        <div className="grid grid-flow-row-dense grid-rows-1 grid-cols-2">
            <h3 className=""> Current Points : {points}</h3>
        <button
          className="bg-blue-500 text-white px-2 py-2 rounded hover:bg-blue-600"
          onClick={() => {createBid(index); closeModal();}}
        >
          Bid
        </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;