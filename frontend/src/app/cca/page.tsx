"use client"; // This is a client component 👈🏽

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUser, User } from "../redux/Resources/userSlice";
import { useRouter } from "next/navigation";
import { Alert, Snackbar, AlertColor } from "@mui/material";
import { ToastMessage } from "../dashboard/page";

import { Modal } from "reactstrap";
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
const axiosWithCredentials = axios.create({
  withCredentials: true,
});
axios.defaults.withCredentials = true;

const CCA: React.FC = () => {
  const user = useSelector(selectUser);
  const route = useRouter();
  const dispatch = useDispatch();

  const [isNav, setIsNav] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // used cons
  const [ccaList, setCcaList] = useState<string[]>([
    "first",
    "second",
    "third",
  ]);
  const [registeredCca, setRegisteredCca] = useState<string[]>([]);
  const [selectedCca, setSelectedCca] = useState<string[]>([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

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
        setCcaList(response.data.data.cca.list);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getMyCca = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cca/registered`
      );
      if (response.data.success) {
        setCcaList(response.data.data.cca.registered);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      // const payload = JSON.stringify();
      const res = await axiosWithCredentials.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cca/signup`
      );
      if (res.data.success) {
        console.log("Successfully registered");
        setToast({ message: "Cca submitted", severity: "success" });
        updateUser();
      } else {
        console.error("Registration failed");
        setToast({ message: "Cca failed to be registered", severity: "error" });
      }
    } catch (error) {
      console.error("Error during form submission", error);
    }
  };

  const handleClick = (name: string) => {
    if (selectedCca.indexOf(name) == -1) {
      const arr = selectedCca;
      arr.push(name);
      setSelectedCca(arr);
    } else {
      var arr = selectedCca.filter((e) => e !== name);
      setSelectedCca(arr);
    }
    console.log(selectedCca);
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
              <div>
                {registeredCca &&
                  registeredCca.map((name) => <div>{name}</div>)}
              </div>
            </div>
            <div className="flex flex-row bg-gray-200 rounded-lg px-2 py-1 items-center justify-between">
              <p className="font-bold">Your current CCAs:&nbsp;</p>
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
          {ccaList.map((name) => (
            <div
              key={name}
              className={`bg-gray-800
                            h-16 w-16 flex items-center justify-center text-white font-semibold text-xl cursor-pointer hover:bg-gray-500`}
              onClick={() => handleClick(name)}
            >
              {name}
            </div>
          ))}

          {isFormModalOpen && selectedCca !== null && (
            <Modal
              isOpen={isFormModalOpen}
              toggle={() => setIsFormModalOpen(false)}
            >
              <div>
                <form>
                  <label>
                    Name
                    <input type="text" name="name" />
                  </label>
                  <label>
                    Telegram
                    <input type="text" name="telegram" />
                  </label>
                  <label>
                    Email
                    <input type="text" name="email" />
                  </label>
                </form>
              </div>
              <div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-2 py-2 rounded hover:bg-blue-600 focus:outline-none"
                  onClick={(e) => handleSubmit(e)}
                >
                  Submit
                </button>{" "}
              </div>
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
};

export default CCA;
