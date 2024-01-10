import React, { useEffect } from "react";
import { Bidding } from "../dashboard/page";
import { ToastMessage } from "../dashboard/page";
import { CcaData } from "../cca/page";

interface CcaList {
  ccas: string[];
  setMyCca: React.Dispatch<React.SetStateAction<string[]>>;
  updateUser: () => void;
  handleOpen: () => void;
  setToast: React.Dispatch<React.SetStateAction<ToastMessage>>;
  selectedCca: string;
}

const axios = require("axios");
const axiosWithCredentials = axios.create({
  withCredentials: true,
});

const CcaTable: React.FC<CcaList> = ({
  ccas,
  setMyCca,
  updateUser,
  handleOpen,
  setToast,
  selectedCca,
}) => {
  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      const res = await axiosWithCredentials.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cca/${selectedCca}`
      );
      if (res.data.success) {
        console.log("Successfully registered");
        setToast({ message: "Cca submitted", severity: "success" });
        handleOpen();
        updateUser();
      } else {
        console.error("Registration failed");
        setToast({ message: "Cca failed to be registered", severity: "error" });
        handleOpen();
      }
    } catch (error) {
      console.error("Error during form submission", error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between space-x-4 py-2">
        <h2 className="text-xl font-semibold py-2">Submit new bids:</h2>
        <div className="flex space-x-2 items-center justify-between">
          <div className="flex rounded-lg text-orange-400 text-sm font-bold p-2">
            <svg
              className="h-5 w-5"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12" y2="16" />
            </svg>
            <p className="pl-2">Ensure you click submit to confirm changes</p>
          </div>

          {ccas.length == 0 ? (
            <></>
          ) : (
            <button
              type="submit"
              className="bg-blue-500 text-white px-2 py-2 rounded hover:bg-blue-600 focus:outline-none"
              onClick={(e) => handleSubmit(e)}
            >
              Submit
            </button>
          )}
        </div>
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
          {ccas.map((cca, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="px-6 py-4 whitespace-no-wrap">{index + 1}</td>
              <td className="px-6 py-4 whitespace-no-wrap">{cca}</td>
              <td className="px-6 py-4 whitespace-no-wrap">
                {/* <button
                  className="text-red-500 bg-red-100 hover:bg-red-200 px-3 py-1 rounded focus:outline-none"
                  onClick={() => deleteBid(index)}
                >
                  Delete
                </button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default CcaTable;
