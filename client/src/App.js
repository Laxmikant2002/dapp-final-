import Login from "./pages/Login";
import Nav from "./pages/Nav";
import Dashboard from "./pages/Dashboard";
import Candidate from "./pages/Candidate";
import Voter from "./pages/Voter";
import Vote from "./pages/Vote"; // Renamed import to avoid conflict
import ElectionCommission from "./pages/ElectionCommission";
// import { RouterProvider,createBrowserRouter,Navigate,Router,Routes, Route } from "react-router-dom";
import { BrowserRouter as Router,Routes, Route } from "react-router-dom";
import {useState,useEffect} from 'react';
import "./App.css";
import {toast,Toaster} from "sonner";
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from "@vercel/analytics/react"

function App() {

  const [state,setState] =useState({
    provider:null,
    contract:null,
    signer:null
  });

  const [info,setInfo]= useState()

  const [pIdEc,setPIdEc] = useState({       //Pid is short for current poll id and Ec is for election commsion 
    pollId:null,
    EcAddress:null      
  })

  const setinfo = async(data)=>{
    setInfo(data)
  }

  const details = async(_pollId,_EcAddress) =>{
      setPIdEc({pollId:_pollId,EcAddress:_EcAddress})
  }

  const wallet =async(provider,contract,signer)=>{   //this function sets the provider and signer or EOA address of the client that has logged in 
    setState({provider:provider,contract:contract,signer:signer})
  }

  const handleCase =(name)=>{    //For converting the case , First letter upper case and rest lower case
    let temp = name.slice(0,1)
    let temp1 =  name.slice(1,name.length)
    temp = temp.toUpperCase()
    temp1 = temp1.toLowerCase()
    return (temp  + temp1)
  }

  const checkLogin= ()=>{
    if(state.provider === null || state.contract === null  || state.signer === null ){
      toast.error("Please login again")
    }
    return true;
  }
  
  useEffect(() => {
    checkLogin();
  }, []); // Removed 'checkLogin' from the dependency array as it doesn't change

  console.log("Logged in user Id", state.signer)

  return ( 
    <>
    <div className="bg-slate-50 w-full h-screen dark:bg-slate-800  overflow-hidden transition-colors duration-700 ">
      
      <Nav />
    <Analytics />
    <SpeedInsights />
    <Router>
      <Routes>
        <Route path="/" element={<Login wallet={wallet} />} />
        <Route path="/Dashboard" element={<Dashboard state={state} info={info} details={details} setinfo={setinfo} pIdEc={pIdEc}  />} />
        <Route path="/Candidate" element={<Candidate state={state} handleCase={handleCase} />} />
        <Route path="/Voter" element={<Voter state={state} handleCase={handleCase} />} />
        <Route path="/Vote" element={<Vote state={state} handleCase={handleCase} />} /> {/* Updated route */}
        <Route path="/ElectionCommission" element={<ElectionCommission state={state} handleCase={handleCase} />} />
      </Routes>
    </Router>

      <Toaster richColors position="top-center" closeButton />
    </div>
    </>
  );
}

export default App;



