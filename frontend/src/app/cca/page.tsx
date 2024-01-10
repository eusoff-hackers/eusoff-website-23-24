"use client"; // This is a client component 👈🏽

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUser, User } from "../redux/Resources/userSlice";
import { useRouter } from "next/navigation";
import { Alert, Snackbar, AlertColor } from "@mui/material";
import { ToastMessage } from "../dashboard/page";

import Modal from "../components/Modal/modal";
import BiddingTable from "../components/BiddingTable";
import NavBar from "../components/NavBar";
import Loading from "../components/Loading";
import { AxiosError } from "axios";
import Legend from "../components/Legend";
import CcaTable from "../components/CcaTable";

export interface CcaData {
  name: string;
  tele: string;
  email: string;
}

const axios = require("axios");
axios.defaults.withCredentials = true;

const CCA: React.FC = () => {
  const user = useSelector(selectUser);
  const route = useRouter();
  const dispatch = useDispatch();

  const [isNav, setIsNav] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // used cons
  const [ccaList, setCcaList] = useState<string[]>([]);
  const [myCca, setMyCca] = useState<string[]>(["first", "second"]);
  const [selectedCca, setSelectedCca] = useState<string>("");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const [toast, setToast] = useState<ToastMessage>({
    message: "",
    severity: "error",
  });
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const getCcaList = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/CCA/list`
      );
      if (response.data.success) {
        setCcaList(response.data.data.cca.list);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getMyCca = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/CCA/registered`
      );
      if (response.data.success) {
        setCcaList(response.data.data.cca.registered);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const updateUser = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/info`
      );

      if (response.data.success) {
        const newUser: User = {
          username: response.data.data.user.username,
          teams: response.data.data.user.teams,
          bids: response.data.data.user.bids,
          isEligible: response.data.data.user.isEligible,
          role: response.data.data.user.role,
          year: response.data.data.user.year,
          points: response.data.data.user.points,
          allocatedNumber: response.data.data.user.allocatedNumber,
          round: response.data.data.user.bidding_round,
        };
        console.log("updated user");
        dispatch(setUser(newUser));
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;

        if (axiosError.response.status == 401) {
          console.error("Session Expired");
          dispatch(setUser(null));
          route.push("/");
        }
      }
      console.error(`Error during update. ${error}`, error);
    }
  };

  useEffect(() => {
    // getCcaList();
    setIsNav(true);
    setIsClient(true);
    updateUser();
    console.log("Saved user: " + JSON.stringify(user));
  }, []);

  //auth
  useEffect(() => {
    if (user == null) {
      route.push("/");
    }
  }, [user, route]);

  useEffect(() => {
    // getMyCca();
  }, [selectedCca]);

  return !isClient || user == null ? (
    <Loading />
  ) : (
    <div className="w-full flex flex-col lg:flex-row">
      {isNav && <NavBar />}
      <div className="flex-1 p-5 light:bg-white-800 text-black">
        <div className="border-b-2 pb-2">
          <h2 className="text-2xl font-bold mb-2">Hello, {user.username}</h2>
          <div className="space-y-2">
            <div className="bg-gray-200 rounded-lg px-2 py-1">
              <p className="font-bold">Your current CCAs:</p>
              <div>{myCca && myCca.map((name) => <div>{name}</div>)}</div>
            </div>
            <div className="flex flex-row bg-gray-200 rounded-lg px-2 py-1 items-center justify-between">
              <p className="font-bold">Your current CCAs:&nbsp;</p>
            </div>
          </div>
          {ccaList.length > 0 ? (
            <CcaTable
              ccas={ccaList}
              setMyCca={setMyCca}
              updateUser={updateUser}
              handleOpen={handleOpen}
              setToast={setToast}
              selectedCca={selectedCca}
            />
          ) : (
            <div>Click on a cca on the table to register a ccas</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CCA;
