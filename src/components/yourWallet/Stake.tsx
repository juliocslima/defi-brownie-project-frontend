import { formatUnits } from "@ethersproject/units";
import { Button, CircularProgress, Input, Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { useEthers, useTokenBalance, useNotifications } from "@usedapp/core";
import { utils } from "ethers";
import React, { useEffect, useState } from "react";
import { useStakeTokens } from "../../hooks";
import { Token } from "../Main";

interface StakeProps {
  token: Token;
}

export const Stake = ( {token} : StakeProps ) => {
  const { address: tokenAddress , name } = token;
  const { account } = useEthers();
  const tokenBalance = useTokenBalance(tokenAddress, account);
  const formattedTokenBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0;

  const {notifications} = useNotifications();

  const [amount, setAmount] = useState<number | string | Array<number | string>>(0);
  const [state, setState] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = event.target.value === "" ? "" : Number(event.target.value)
    setAmount(newAmount);
  }

  const handleStakeSubmit = () => {
    const amountAsWei = utils.parseEther(amount.toString());
    return approveAndStake(amountAsWei.toString());
  }

  const { approveAndStake, approveAndStakeErc20State } = useStakeTokens(tokenAddress);

  const isMining = approveAndStakeErc20State.status === "Mining";
  const [showErc20ApprovalSuccess, setshowErc20ApprovalSucces] = useState(false);
  const [showStakeTokenSuccess, setshowStakeTokenSuccess] = useState(false);
  
  const handleCloseSnack = () => {
    setshowErc20ApprovalSucces(false);
    setshowStakeTokenSuccess(false)
  }

  useEffect(() => {
    if (
      notifications.filter(
        (notification) =>
          notification.type === "transactionSucceed" &&
          notification.transactionName === "Approve ERC20 transfer"
      ).length > 0
    ) {
      setshowErc20ApprovalSucces(true);
      setshowStakeTokenSuccess(false);
    }

    if (
      notifications.filter(
        (notification) =>
          notification.type === "transactionSucceed" &&
          notification.transactionName === "Stake tokens"
      ).length > 0
    ) {
      setshowErc20ApprovalSucces(false);
      setshowStakeTokenSuccess(true);
      setAmount("");
    }
  }, [notifications, showErc20ApprovalSuccess, showStakeTokenSuccess]);

  return (
    <>
      <Input name="amountToStake" onChange={handleInputChange} value={amount}></Input>
      <Button 
        onClick={handleStakeSubmit}
        color="primary" 
        size="large"
        disabled={isMining}>{isMining ? <CircularProgress size={26} /> : "Stake!!!"} </Button>
      <Snackbar 
        open={showErc20ApprovalSuccess}
        autoHideDuration={5000}
        onClose={handleCloseSnack}
      >
        <Alert onClose={handleCloseSnack} severity="success">
          ERC20 token transfer approved! Now approve the 2nd transaction.
        </Alert>
      </Snackbar>
      <Snackbar 
        open={showStakeTokenSuccess}
        autoHideDuration={5000}
        onClose={handleCloseSnack}
      >
        <Alert onClose={handleCloseSnack} severity="success">
          Token Staked!
        </Alert>
      </Snackbar>
    </>
  );
}