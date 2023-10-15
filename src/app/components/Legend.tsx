import React from 'react'

export default function Legend() {
  return (
    <div className="pl-7 pt-2">
      <div className="font-bold pb-2">Legend:</div>
      <div className="flex space-x-4 items-center">
        <div className="flex space-x-2">
            <div className="w-6 h-6 rounded-sm bg-gray-800"></div>
            <p>Number Available</p>
        </div>
        <div className="flex space-x-2">
            <div className="w-6 h-6 rounded-sm bg-red-500"></div>
            <p>Number unavailable</p>
        </div>
        <div className="flex space-x-2">
            <div className="w-6 h-6 rounded-sm bg-green-400"></div>
            <p>Your bids submitted</p>
        </div>
      </div>
    </div>
    
);
}
