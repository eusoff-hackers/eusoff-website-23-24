import React from 'react';
import { Bidding } from '../dashboard/page';

interface BiddingList {
  biddings: Bidding[]
  setBiddings: React.Dispatch<React.SetStateAction<Bidding[]>>;
}

const BiddingTable : React.FC<BiddingList> = ({ biddings, setBiddings }) => {

  const deleteBid = (ind : number) => {
    const filteredList = biddings.filter(bidding => bidding.jersey.number != biddings[ind].jersey.number)
    setBiddings(filteredList)
  }

  return (
    <div>
      <h2>Here are the list of your biddings:</h2>
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
                {bidding.jersey.number}
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