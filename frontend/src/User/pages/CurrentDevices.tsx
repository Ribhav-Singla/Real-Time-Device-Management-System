import { useEffect, useRef, useState } from "react";
import CurrentDeviceCard from "../components/CurrentDeviceCard/CurrentDeviceCard";
import { Datepicker, Table } from "flowbite-react";
import { socket, socketState } from "../../socket";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMdArrowDropup } from "react-icons/io";
import { motion } from "framer-motion";
import DeviceFilter from "../../Admin/components/utils/DeviceFilter";

export default function CurrentDevices() {
  const navigate = useNavigate();
  const [devices, setDevices] = useState([]);
  const [mylogs, setMylogs] = useState([]);
  const [originalLogs, setOriginalLogs] = useState([]);
  const deviceContRef = useRef<HTMLDivElement>(null);
  const dateContRef = useRef<HTMLDivElement>(null);

  //@ts-ignore
  const [page, setPage] = useState(1);
  const [showDevice, setShowDevice] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [filterselectedDevices, setFilterSelectedDevices] = useState<String[]>(
    []
  );

  const [filterDate, setFilterDate] = useState("");
  const socketStatus = useRecoilValue(socketState);
  console.log("socket status at current devices: ", socketStatus);

  useEffect(() => {
    if (socketStatus) {
      socket.emit("my devices");
      socket.on("mydevice list", (data, mylogs) => {
        setDevices(data);
        setMylogs(mylogs);
        setOriginalLogs(mylogs);
      });
    }

    return () => {
      socket.off("mydevice list");
    };
  }, [socketStatus]);

  useEffect(() => {
    let filteredLogs = originalLogs;

    if (filterselectedDevices.length > 0) {
      //@ts-ignore
      filteredLogs = filteredLogs.filter((log) =>filterselectedDevices.includes(log.device._id));
    }

    if (filterDate) {
      const selectedDate = new Date(filterDate).setHours(0, 0, 0, 0); // Set time to start of the day
      filteredLogs = filteredLogs.filter((log) => {
        //@ts-ignore
        const logDate = new Date(log.createdAt).setHours(0, 0, 0, 0);
        return logDate === selectedDate;
      });
    }

    setMylogs(filteredLogs);
  }, [filterDate, filterselectedDevices, mylogs]);

  function checkClickOutsideDevice(e:MouseEvent){
    if(deviceContRef.current && !deviceContRef.current.contains(e.target as Node)){
      setShowDevice(false);
    }
  }

  function checkClickOutsideDate(e:MouseEvent){
    if(dateContRef.current && !dateContRef.current.contains(e.target as Node)){
      setShowDate(false);
    }
  }

  useEffect(()=>{
    if(showDevice){
      document.addEventListener('mousedown',checkClickOutsideDevice)
    }
    return ()=>document.removeEventListener('mousedown',checkClickOutsideDevice)
  },[showDevice])

  useEffect(()=>{
    if(showDate){
      document.addEventListener('mousedown',checkClickOutsideDate)
    }
    return ()=>document.removeEventListener('mousedown',checkClickOutsideDate)
  },[showDate])

  return (
    <div className="bg-white">
      <div>
        <div className="flex justify-between items-center p-2">
          <h2 className="font-extrabold text-2xl emp-name">
            {
              //@ts-ignore
              devices && devices[0] && devices[0].name
            }
          </h2>
          <button
            className="btn-enter device-btn bg-green-400 p-2 rounded font-semibold text-white"
            onClick={() => navigate("/user/availableDevices")}
          >
            Add Device
          </button>
        </div>
        <hr />
      </div>
      <div className="grid grid-cols-12 p-5 dev-det">
        <div className="col-span-5 shadow-2xl rounded-lg cur gap-spc main-sc">
          <h1 className="text-lg font-extrabold p-3 pl-3 h-fit rounded-ss-lg rounded-se-lg  bg-gray-100 emp-name">
            Current Devices
          </h1>
          <div className="min-h-screen flex justify-center items-start gap-5 px-2 py-4 flex-wrap cur">
            {devices &&
              devices[0] &&
              //@ts-ignore
              devices[0].devices.map((device) => {
                return (
                  //@ts-ignore
                  <CurrentDeviceCard key={device._id} device={device} />
                );
              })}
          </div>
        </div>
        <div className="col-span-7 bg-gray-100 shadow-2xl rounded-lg">
          <div className="flex justify-between p-2">
            <h1 className="text-lg font-extrabold text-eerieBlack p-1 pl-2 h-fit w-full emp-name ">
              History
            </h1>
            <div className="flex justify-center items-center gap-4 pr-2 ">
              <div className="relative" ref={deviceContRef}>
                <div
                  className="flex justify-center items-center border-2  border-black rounded-lg py-1 px-3 gap-4 cursor-pointer"
                  onClick={() => {
                    setShowDevice(!showDevice);
                    if (showDate) setShowDate(false);
                  }}
                >
                  <h1 className="text-eerieBlack rounded-lg p-[8px]">Device</h1>
                  {!showDevice ? (
                    <IoMdArrowDropdown size={25} className="text-eerieBlack" />
                  ) : (
                    <IoMdArrowDropup size={25} className="text-eerieBlack" />
                  )}
                </div>
                <div className="w-[190px] absolute">
                  {
                    //@ts-ignore
                    showDevice ? ( <DeviceFilter filterselectedDevices={filterselectedDevices} setFilterSelectedDevices={setFilterSelectedDevices} setPage={setPage} />
                    ) : (
                      ""
                    )
                  }
                </div>
              </div>
              <div className="relative" ref={dateContRef}>
                <div
                  className="flex justify-center items-center border-2 border-black rounded-lg gap-4 py-1 px-3 cursor-pointer"
                  onClick={() => {
                    setShowDate(!showDate);
                    if (showDevice) setShowDevice(false);
                  }}
                >
                  <h1 className="text-eerieBlack p-2 rounded-lg px-8">Date</h1>
                  {!showDate ? (
                    <IoMdArrowDropdown size={25} className="text-eerieBlack" />
                  ) : (
                    <IoMdArrowDropup size={25} className="text-eerieBlack" />
                  )}
                </div>
                <div className="w-[180px] absolute left-[-9.2rem]">
                  {showDate ? (
                    <motion.div
                      initial={{
                        scale: 0.5,
                      }}
                      animate={{
                        scale: 1,
                      }}
                      className="max-w-[100%] mt-2 absolute top-0 left-0 z-10"
                    >
                      <Datepicker
                        defaultValue={Date.now()}
                        onSelectedDateChanged={
                          //@ts-ignore
                          (e: SetStateAction<string>) => {
                            setFilterDate(e);
                          }
                        }
                      />
                    </motion.div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="max-h-[800px] overflow-y-scroll rounded-lg">
            <Table striped className="w-full">
              <Table.Head>
                <Table.HeadCell className="text-base text-center">
                  Date
                </Table.HeadCell>
                <Table.HeadCell className="text-base text-center">
                  Device
                </Table.HeadCell>
                <Table.HeadCell className="text-base text-center">
                  Model
                </Table.HeadCell>
                <Table.HeadCell className="text-base text-center">
                  Login Time
                </Table.HeadCell>
                <Table.HeadCell className="text-base text-center">
                  Logout Time
                </Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {mylogs.length > 0 ? (
                  mylogs.map((log) => {
                    //@ts-ignore

                    return (
                      //@ts-ignore
                      <Table.Row key={log._id}>
                        <Table.Cell className="font-semibold text-center p-0">
                          {
                            //@ts-ignore
                            new Date(log.createdAt).toDateString()
                          }
                        </Table.Cell>
                        <Table.Cell className="font-semibold text-center flex justify-center items-center p-0 py-1">
                          <div className="max-w-[60px] max-h-[60px] flex justify-center items-center rounded">
                            <img
                              //@ts-ignore
                              src={log.device.image ? `${import.meta.env.VITE_BACKEND_URL}/${log.device.image}`: "/device.png"}
                              alt="Device Image"
                              className="object-contain max-h-[80px] rounded"
                            />
                          </div>
                        </Table.Cell>
                        <Table.Cell className="font-semibold text-center p-0">
                          {
                            //@ts-ignore
                            log.device.model
                          }
                        </Table.Cell>
                        <Table.Cell className="font-semibold text-center p-0">
                          {
                            //@ts-ignore
                            new Date(log.loginTime).toLocaleTimeString()
                          }
                        </Table.Cell>
                        <Table.Cell className="font-semibold text-center p-0">
                          {
                            //@ts-ignore
                            log.logoutTime ? new Date(log.logoutTime).toLocaleTimeString()
                              : "---"
                          }
                        </Table.Cell>
                      </Table.Row>
                    );
                  })
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={5}>
                      <p className="text-center text-2xl">No logs!</p>
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
