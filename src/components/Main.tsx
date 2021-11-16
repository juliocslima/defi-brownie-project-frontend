import { useEthers } from "@usedapp/core";
import helperConfig from "../helper_config.json";
import networkMapping from "../chain_info/deployments/map.json";
import { constants } from "ethers";
import brownieConfig from "../brownie-config.json";
import dapp  from '../images/dapp.png';
import eth from '../images/eth.png';
import dai from '../images/dai.png';
import { YourWallet } from "./yourWallet/YourWallet";
import { makeStyles, Snackbar, Typography } from "@material-ui/core";
import { TokenFarmContract } from "./tokenFarmContract";
import React, { useEffect, useState } from "react"
import Alert from "@material-ui/lab/Alert";

/*

1. Show token values from the wallet
2. Get the address of different tokens
3. Get the balance of the users wallets
4. Send the brownie config to our 'src' folder
5. Send the build folder to our 'src' folder

*/

export type Token = {
  image: string,
  address: string,
  name: string,
}

const useStyles = makeStyles((theme) => ({
  title: {
    color: theme.palette.common.white,
    textAlign: "center",
    padding: theme.spacing(4)
  }
}));

export const Main = () => {

  const classes = useStyles();
  const { chainId, error } = useEthers();
  const networkName = chainId ? helperConfig[chainId] : "ganache";

  // We need to pull the DAPP token address from the .json file written to by Brownie
  const dappTokenAddress = chainId ? networkMapping[String(chainId)]["DappToken"][0] : constants.AddressZero;
  const wethTokenAddress = chainId ? brownieConfig["networks"][networkName.toLowerCase()]["weth_token"] : constants.AddressZero;
  const fauTokenAddress = chainId ? brownieConfig["networks"][networkName.toLowerCase()]["fau_token"] : constants.AddressZero;

  // console.log(dappTokenAddress)
  /**
   * Our single central location to store info on support tokens.
   * This is the only place you'll need to add a new token to get it to display in the UI!
   * 
   * Modularize the addresses like with `dappTokenAddress`
   * To make it chain agnostic
   */
  const supportedTokens: Array<Token> = [
    {
      image: dapp,
      address: dappTokenAddress,
      name: "DAPP"
    },
    {
      image: eth,
      address: wethTokenAddress,
      name: "WETH"
    },
    {
      image: dai,
      address: fauTokenAddress,
      name: "DAI"
    },
  ]

  const [showNetworkError, setShowNetworkError] = useState(false)

  const handleCloseNetworkError = (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return
    }

    showNetworkError && setShowNetworkError(false)
  }

  /**
   * useEthers will return a populated 'error' field when something has gone wrong.
   * We can inspect the name of this error and conditionally show a notification
   * that the user is connected to the wrong network.
   */
   useEffect(() => {
    if (error && error.name === "UnsupportedChainIdError") {
      !showNetworkError && setShowNetworkError(true)
    } else {
      showNetworkError && setShowNetworkError(false)
    }
  }, [error, showNetworkError])

  return (
    <>
      <Typography
        variant="h2"
        component="h1"
        classes={{
          root: classes.title,
        }}
      >
        Dapp Token Farm
      </Typography>
      <YourWallet supportedTokens={supportedTokens} />
      <TokenFarmContract supportedTokens={supportedTokens} />
      <Snackbar
        open={showNetworkError}
        autoHideDuration={5000}
        onClose={handleCloseNetworkError}
      >
        <Alert onClose={handleCloseNetworkError} severity="warning">
          You gotta connect to the Kovan or Rinkeby network!
        </Alert>
      </Snackbar>
    </>
  );

}