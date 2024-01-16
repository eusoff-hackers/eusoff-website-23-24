"use client"; // This is a client component 👈🏽

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUser, User } from "../redux/Resources/userSlice";
import { useRouter } from "next/navigation";
import { Modal, Alert, Snackbar, AlertColor, Box } from "@mui/material";
import { ToastMessage } from "../dashboard/page";
import NavBar from "../components/NavBar";
import Loading from "../components/Loading";
import { AxiosError } from "axios";
import CcaTable from "../components/CcaTable";
import FormModal from "../components/Modal/FormModal";
import { register } from "module";

export interface UserData {
  name: string;
  telegram: string;
  email: string;
}
export interface CcaData {
  _id: string;
  name: string;
  category: string;
  heads: string[];
  contacts: string[];
  description: string;
  committees: string[];
}

export interface UserCcaData {
  info: UserData;
  ccas: CcaData[];
  isOpen: boolean;
}

const axios = require("axios");

axios.defaults.withCredentials = true;
const axiosWithCredentials = axios.create({
  withCredentials: true,
});

const CCA: React.FC = () => {
  const user = useSelector(selectUser);
  const route = useRouter();
  const dispatch = useDispatch();

  const [isNav, setIsNav] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // used cons
  const [ccaList, setCcaList] = useState<CcaData[]>([
    // { _id: "testing", name: "testing" },
  ]);
  const [registeredCca, setRegisteredCca] = useState<CcaData[]>([]);
  const [selectedCca, setSelectedCca] = useState<CcaData[]>([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserData>();
  const [isOpen, setIsOpen] = useState<boolean>();
  const [committeesModal, setCommitteesModal] = useState<boolean>();
  const [toast, setToast] = useState<ToastMessage>({
    message: "",
    severity: "error",
  });

  const handleOpen = () => {
    setIsFormModalOpen(true);
  };

  const getCcaList = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cca/list`
      );
      if (response.data.success) {
        setCcaList(response.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getCcaUserProps = async () => {
    try {
      const res = await axiosWithCredentials.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cca/info`
      );
      console.log(res);
      if (res.data.success) {
        setRegisteredCca(res.data.data.ccas);
        setUserInfo(res.data.data.info);
        setIsOpen(res.data.data.isOpen);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = (cca: CcaData) => {
    if (selectedCca.indexOf(cca) == -1 && registeredCca.indexOf(cca) == -1) {
      // console.log(registeredCca);
      // console.log(cca);
      if (cca.committees[0] != "") {
        setCommitteesModal(true);
      }
      setSelectedCca((selectedCca) => [...selectedCca, cca]);
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
    getCcaList();
    setIsNav(true);
    updateUser();
    setIsClient(true);
    getCcaUserProps();
    console.log("Saved user: " + JSON.stringify(user));
  }, []);

  //auth
  useEffect(() => {
    if (user == null) {
      route.push("/");
    }
  }, [user, route]);

  // useEffect(() => {
  //   getRegisteredCca();
  // }, [selectedCca]);

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
              <div>
                {registeredCca &&
                  registeredCca.map((cca) => <div>{cca.name}</div>)}
              </div>
              {/* <p className="font-bold">Your selected CCAs:</p>
              <div>
                {selectedCca && selectedCca.map((cca) => <div>{cca.name}</div>)}
              </div> */}
            </div>
          </div>
          {ccaList.length > 0 ? (
            <CcaTable
              selectedCcas={selectedCca}
              setSelectedCca={setSelectedCca}
              updateUser={updateUser}
              handleOpen={handleOpen}
              setToast={setToast}
            />
          ) : (
            <div>Click on a cca on the table to register a ccas</div>
          )}
        </div>
        <div className="grid  pl-7 grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-4 gap-y-5 mt-5">
          {isOpen ? (
            ccaList.map((cca) => (
              <div
                key={cca._id}
                className={`bg-gray-800
                            h-16 w-30 flex items-center justify-center text-white font-semibold text-xl cursor-pointer hover:bg-gray-500`}
                onClick={() => handleClick(cca)}
              >
                {cca.name}
              </div>
            ))
          ) : (
            <div>Cca Application not open yet</div>
          )}

          {isFormModalOpen && selectedCca !== null && (
            <FormModal
              isOpen={isFormModalOpen}
              ccas={selectedCca}
              info={userInfo}
              handleClose={() => {
                setIsFormModalOpen(false);
                getCcaUserProps();
              }}
              setToast={setToast}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CCA;
