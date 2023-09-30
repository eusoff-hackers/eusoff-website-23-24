import React from 'react';
import { Bidding } from '@/app/dashboard/page';

interface ModalProps {
  closeModal: () => void;
  index: number;
  biddings: Bidding[];
  setBiddings: React.Dispatch<React.SetStateAction<Bidding[]>>;
}

const fetchList:any = (index: number) => {
    return 1;
}

const fetchPoints = () => {
    return 1;
}

const Modal: React.FC<ModalProps> = ({ closeModal, index, biddings, setBiddings }) => {

  const createBid = (ind : number) => {
    console.log(biddings)

    if (biddings.length > 4) { //number is 4 because when open modal for 5th number, will record 4 numbers in bidding
      // Include a popup to tell user not to bid for more than 5 numbers
      console.log("Cannot bid for more than 5 numbers")
      return
    } 

    const duplicateArr = biddings.filter(bidding => bidding.jersey.number == ind);

    if (duplicateArr.length !== 0) {
      // Include a popup to tell user to not bid for duplicates
      console.log("Cannot bid for duplicate numbers")
      return
    }

    const newBidding : Bidding = {
      jersey: {
        number: ind
      }
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
        <p className="mb-4">List of top bidders.</p>
        <div className="grid grid-flow-row-dense grid-rows-1 grid-cols-2">
            <h3 className=""> Current Points : {index}</h3>
        <button
          className="bg-blue-500 text-white px-2 py-2 rounded hover:bg-blue-600"
          onClick={() => createBid(index)}
        >
          Bid
        </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;