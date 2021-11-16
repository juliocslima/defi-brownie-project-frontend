import { useContractFunction, useEthers } from "@usedapp/core"
import { constants, utils } from "ethers";
import { Contract } from '@ethersproject/contracts'
import TokenFarm from "../chain_info/contracts/TokenFarm.json";
import ERC20 from "../chain_info/contracts/MockERC20.json";
import networkMapping from "../chain_info/deployments/map.json";
import { useEffect, useState } from "react";

export const useStakeTokens = (tokenAddress : string) => {
  const { chainId } = useEthers();
  const { abi } = TokenFarm;
  const tokenFarmAddress = chainId ? networkMapping[String(chainId)]["TokenFarm"][0] : constants.AddressZero;
  const tokenFarmInterface = new utils.Interface(abi);
  const tokenFarmContract = new Contract(tokenFarmAddress, tokenFarmInterface);

  const {send: stakeTokensSend, state: stakeTokensState} = 
    useContractFunction(tokenFarmContract, "stakeTokens",{
      transactionName: "Stake tokens",
    });

  const erc20ABI = ERC20.abi;
  const erc20Interface = new utils.Interface(erc20ABI);
  const tokenContract = new Contract(tokenAddress, erc20Interface);

  const { send: approveErc20Send, state: approveAndStakeErc20State } =
    useContractFunction(tokenContract, "approve", {
      transactionName: "Approve ERC20 transfer",
    });

  const [amountToStake, setAmountToStake] = useState("0");

  const approveAndStake = (amount: string) => {
    setAmountToStake(amount);
    return approveErc20Send(tokenFarmAddress, amount);
  }

  useEffect(() => {
    if(approveAndStakeErc20State.status === "Success") {
      stakeTokensSend(amountToStake, tokenAddress)
    }
  }, [approveAndStakeErc20State, amountToStake, tokenAddress])

  const [state, setState] = useState(approveAndStakeErc20State);

  useEffect(() => {
    if(approveAndStakeErc20State.status === "Success") {
      setState(stakeTokensState);
    } else {
      setState(approveAndStakeErc20State);
    }

  }, [approveAndStakeErc20State, stakeTokensState]);

  return { approveAndStake, approveAndStakeErc20State }
}
