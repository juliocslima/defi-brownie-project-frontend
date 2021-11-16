import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
  container: {
    display: "inline-grid",
    gridTemplateColumns: "auto auto auto",
    gap: theme.spacing(1),
    alignItems: "center",
  },
  tokenImageSource: {
    width: "32px",
  },
  amount: {
    fontWeight: 700,
  }
}))

interface BalanceMessageProps {
  label: string,
  amount: number,
  tokenImageSource: string
}

export const BalanceMessage = ( { label, amount, tokenImageSource } : BalanceMessageProps) => {
  const classes = useStyles();

  return(
    <div className= {classes.container}>
      <div>{label}</div>
      <div className={classes.amount}>{amount}</div>
      <img className={classes.tokenImageSource} src={tokenImageSource} alt="token logo" />
    </div>
  )
}