import { motion } from "framer-motion";
import Device from "/Device.png";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";

interface Device {
  _id: string;
  bookedBy: string;
  bookedDate: string;
  company: string;
  createdAt: string;
  image: string;
  isBooked: boolean;
  model: string;
}

export default function CurrentDeviceCard({ device }: { device: Device }) {
  const [btnLoader, setBtnLoader] = useState(false);
  const [isReturn, setIsReturn] = useState(false);

  const handleReturn = async () => {
    setBtnLoader(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/returnDevice/${device._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('userLoginAllowed') ? sessionStorage.getItem('userLoginToken') : localStorage.getItem("token")}`,
          },
        }
      );
      toast.success(response.data.message);
      setBtnLoader(false);
    } catch (error) {
      console.log("error occured while return the device: ", error);
      //@ts-ignore
      toast.error(error.response.data.message);
      setBtnLoader(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{
          scale: 0,
        }}
        animate={{
          scale: 1,
          boxShadow: "0 0 2px gray, 0 0 6px gray, 0 0 16px gray",
          transition: {
            duration: 0.5,
            ease: "easeInOut",
          },
        }}
        whileHover={{
          scale: 1.05,
          transition: {
            duration: 0.05,
            ease: "linear",
          },
        }}
        className="w-fit bg-white rounded-lg cursor-pointer h-fit flex-col justify-center items-center mob dev h-fit-crds"
      >
        <motion.div className="">
          <img
            src={
              device.image ? `${import.meta.env.VITE_BACKEND_URL}/${device.image}` : "/device.png"
            }
            alt="Device Image"
            className="text-center object-contain max-h-[180px] usr"
          />
        </motion.div>
        <motion.h1 className="text-2xl font-bold text-center pb-2 text-black text-box">
          <span className="device-model">{device.model} {device.company}</span>
        </motion.h1>
        <div className="w-full flex justify-center items-center p-2">
          <button
            className="btn-enter text-lg rounded text-white font-bold w-[50%] p-1 bg-red-500 hover:bg-red-600"
            onClick={() => setIsReturn(!isReturn)}
          >
            Return
          </button>
        </div>
      </motion.div>
      {isReturn ? (
        <div className="overlay z-10">
          <div className="online-model return whitespace-nowrap font-medium  text-base bg-blackOlive text-floralWhite text-center rounded-md py-5 px-5 delete-btn">
            <p className="text-black font-semibold">
              Are you sure you want to return this device?
            </p>
            <div>
              <p style={{color:"#fa311e"}}>{device.model} {device.company}</p>
            </div>
            <div className="flex justify-center items-center gap-5 cursor-pointer mt-4">
              <span
                className="btn-no text-blue-500 bg-eerieBlack py-2 px-4 rounded"
                onClick={handleReturn}
              >
                {btnLoader ? "Returning..." : "Yes"}
              </span>
              {btnLoader ? (
                ""
              ) : (
                <span
                  className="btn-no text-red-600 bg-eerieBlack py-2 px-4 rounded"
                  onClick={() => setIsReturn(!isReturn)}
                >
                  No
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
