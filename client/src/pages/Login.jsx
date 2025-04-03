import React from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ wallet }) => {
  const navigate = useNavigate();

  const connectWallet = async () => {
    navigate("/Dashboard"); // Directly navigate to the dashboard
  };

  return (
    <div className="flex h-[90%]">
      <div className="invisible md:visible w-[50%] bg-slate-50 h-[90%] flex flex-col justify-center items-center flex-wrap dark:bg-slate-800">
        <div className="grid grid-rows-2 grid-flow-col w-[50%]">
          <div>
            <h1 className="text-[#4263EB] md:text-4xl">Voting Dapp</h1>
          </div>
          <div className="bg-yellow md:w-[90%] text-left">
            <p className="font-extralight dark:text-white">
              A decentralized Polling system for electing candidates in the
              election, built completely using{" "}
              <span className="font-bold">Blockchain Technology</span>.
            </p>
          </div>
        </div>
      </div>

      <div className="w-[100%] h-[100%] -mt-10 md:mt-0 md:w-[48%] md:h-[90%] bg-slate-50 flex justify-center items-center absolute md:relative dark:bg-slate-800">
        <div className="bg-white w-[90%] h-[80%] md:p-10 md:w-[70%] md:h-[95%] flex flex-col justify-center items-center space-y-20 rounded-xl dark:bg-slate-900 shadow-2xl dark:shadow-cyan-500/50">
          <div>
            <img
              className="h-[95%] md:h-[100%] mr-1 md:mr-0"
              src="https://voting-dapp.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fimage%2Fpublic%2Fsvg%2Flogo.b954829cff7fddca2bb11cc74a1876a5.svg&w=384&q=75"
              alt=""
            ></img>
            <h1 className="text-[#4263EB] font-bold md:text-3xl text-2xl">
              Votechain
            </h1>
          </div>

          <div>
            <button
              className="bg-[#4263EB] p-3 text-xl md:text-base rounded-md text-white hover:bg-[#4e6dec] shadow-2xl shadow-[#4e6dec] transition-all duration-700 hover:shadow-[0_3px_10px_rgb(0.4,0.4,0.4,0.4)] dark:hover:shadow-cyan-500/50"
              onClick={connectWallet}
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;