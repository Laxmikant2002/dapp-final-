import React, { useCallback } from "react";
import Navigation from "./Navigation";
import List from "../components/List";
import UserCard from "../components/UserCard";
import ElectionCard from "../components/ElectionCard";
import Winner from "../components/Winner";
import { useEffect, useState } from "react";
import { createClient, cacheExchange, fetchExchange } from "@urql/core";
import { toast } from "sonner";
// import { Link } from "react-router-dom";

const Dashboard = ({ state, info, details, pIdEc, setinfo }) => {
  const [run, setRun] = useState(false);

  const queryUrl = "https://api.studio.thegraph.com/query/55899/testing/version/latest";
  const query = `{
    ecWinners(first: 10 where: {_electionCommission: "${pIdEc.EcAddress}"}) {
      id
      _info_pollId
      _info_winnerName
      _info_partyName
      _electionCommission
    }
    candidates(first: 100, where: {_pollId:  "${pIdEc.pollId}"}) {
      id
      _name
      _party
      _candidateId
      _electionCommission
      _pollId
    }
    voters(where: {_pollId:  "${pIdEc.pollId}"}, first: 100) {
      _name
      _voterAdd
      _votedTo
      _pollId
      _electionCommission
    }
  }
`;

  const client = createClient({
    url: queryUrl,
    exchanges: [cacheExchange, fetchExchange],
  });

  const getPidEc = useCallback(async () => {
    if (!state.contract) {
      console.error("Contract is not initialized");
      toast.error("Contract is not initialized. Please connect your wallet.");
      return;
    }
    try {
      const pollId = Number(await state.contract.nextPollId());
      const electionCommission = await state.contract.electionCommission();
      details(pollId, electionCommission);
    } catch (error) {
      console.error("Error fetching poll ID or election commission:", error);
      toast.error("Failed to fetch poll details. Please try again.");
    }
  }, [state.contract, details]);

  const setifo = useCallback(async () => {
    const { data } = await client.query(query).toPromise();
    setinfo(data);
    setRun(typeof data !== "undefined");
  }, [client, query, setinfo]);

  useEffect(() => {
    getPidEc();
    setifo();
  }, [getPidEc, setifo]);

  return (
    <div className="flex  h-[100%]  space-x-12 ">
      <Navigation />
      <div className=" p-4 w-full flex space-x-20 dark:text-slate-50">

        {/* Candidate detail cards starts */}
        <div className=" w-[60%] h-[100%] p-4 " id="UserVotingStatus">
          <h1 className="mb-10 tracking-wide text-gray-600 dark:text-gray-400 text-2xl ">Registered Candidates</h1>
          <div className=" w-[100%] gap-4">

            {/* Candidate detail cards start here */}
            {run ? (
                <div className="grid grid-rows-2 grid-flow-col gap-12 w-[90%] md:mb-10">
                  {info.candidates.map((candidate, index) => {
                    return (
                      <List
                        state={state}
                        key={index}
                        name={candidate._name}
                        party={candidate._party}
                        id={candidate._candidateId}
                        setValue={true}
                      />
                    );
                  })}
                </div>
            ) : (
                <div className="grid grid-rows-1 grid-flow-col gap-12 w-[90%] md:mb-10">
                  <List setValue={false} />
                </div>
            )}
          </div>
          
          {/* Winner starts here */} 
          <div className=" w-[90%] ">
            <h1 className="mb-10 tracking-wide text-gray-600 dark:text-gray-400 text-2xl ">Winner</h1>    
            <Winner state={state} />
          </div>
          {/* Winner ends here */}
          
        </div>
        {/* Candidate detail cards ends */}

        {/* Election and user detail cards starts */}
        <div className=" w-[35%] h-[100%] p-4 flex flex-col space-y-10 " id="UserVotingStatus">
          <ElectionCard state={state} info={info} />
          <UserCard state={state} />
        </div>
        {/* Election and user detail cards ends */}
        
      </div>
    </div>
  );
};

export default Dashboard;