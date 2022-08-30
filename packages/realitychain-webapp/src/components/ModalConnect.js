import React from "react";

import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import { createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) =>
  createStyles({
    input: {
      "& .MuiInputBase-root": {
        fontSize: 13,
      },
      "& .MuiInputBase-input": {
        background: "rgba(15, 19, 25, 1)",
        padding: "10px 8px",
        borderRadius: 4,
      },
      "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
        borderBottom: "none",
      },
      "& .MuiInput-underline:before": {
        borderBottom: "none",
      },
      "& .MuiInput-underline:after": {
        borderBottom: "none",
      },
      "& .MuiInputBase-input.Mui-disabled": {
        color: "#FFF",
        background: "rgba(255, 255, 255, 0.1)",
      },
    },
  })
);

export const ModalConnect = (props) => {
  const { open, onHide, onLogin } = props;
  const style = useStyles();
  const [address, setAddress] = React.useState("paras-token-v2.testnet");

  const handleSetAddress = (e) => {
    setAddress(e.target.value);
  };

  const handleLogin = () => {
    onLogin(address);
  };

  return (
    <Dialog
      onClose={onHide}
      aria-labelledby="customized-dialog-title"
      open={open}
      maxWidth="xs"
    >
      <DialogTitle id="customized-dialog-title">
        Connect your wallet
      </DialogTitle>
      <DialogContent>
        <div style={{}}>
          <Typography variant="subtitle1">
            To deploy and work with your contracts, you must connect your NEAR
            wallet.
          </Typography>
          <TextField
            value={address}
            disabled={true}
            onChange={handleSetAddress}
            style={{ marginBottom: 16, marginTop: 8, minWidth: 100 }}
            className={style.input}
            id="outlined-basic"
            placeholder="Contract ID"
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          variant="text"
          style={{ color: "#D391D6", width: "auto" }}
          onClick={onHide}
        >
          Cancel
        </Button>
        <Button
          variant="text"
          style={{ color: "#D391D6", width: "auto" }}
          onClick={handleLogin}
        >
          connect wallet
        </Button>
      </DialogActions>
    </Dialog>
  );
};
