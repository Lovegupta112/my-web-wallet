import React, { useState } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { derivationPathType } from "./types";
import { Stack } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { Keypair } from "@solana/web3.js";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function WalletInfo({
  wallet,
  open,
  setOpen,
}: {
  wallet: derivationPathType;
  open: boolean;
  setOpen: any;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedMode,setSelectedMode]=useState('devnet');
  const [balance,setBalance]=useState(0);

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const getInfo=async ()=>{
   try{
    const res=await axios.post(`https://solana-${selectedMode}.g.alchemy.com/v2/i7z_ek2AVttiON2GwnXyl_MbLawE2-ML`,
        {
        "jsonrpc":"2.0",
        "id":1,
        "method":"getBalance",
        "params":[`${wallet.publicKey}`]
    })

    setBalance(res?.data?.result?.value);
   }
   catch(error){
    console.log('Error: ',error);
   }
  }

  // const sendSol=async()=>{
  //   try{
  //       const fromkeypair=Keypair.generate();
  //   }
  //   catch(error){

  //   }
  // }

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {wallet.name} wallet
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Stack gap={2}>
            <Stack sx={{ textAlign: "left" }}>
              <Typography variant="h6" sx={{ color: "Black" }}>
                Public key:
              </Typography>
              <Typography>{wallet.publicKey}</Typography>
            </Stack>
            <Stack sx={{ textAlign: "left" }}>
              <Typography variant="h6" sx={{ color: "Black" }}>
                Private key:
              </Typography>
              <Stack direction="row" justifyContent="space-between">
                <input
                  id="standard-adornment-password"
                  type={showPassword ? "text" : "password"}
                  value={wallet.privateKey?.toString()}
                  disabled
                  style={{
                    width: "94%",
                    border: "none",
                    outline: "none",
                    color: "Black",
                  }}
                />
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  sx={{ color: "Black" }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </Stack>
            </Stack>
            <Stack sx={{ textAlign: "left" }}>
              <Typography variant="h6" sx={{ color: "Black" }}>
                 {wallet?.name} : {balance} {wallet?.sign}
              </Typography>
               <select value={selectedMode} onChange={(event)=>setSelectedMode(event.target.value)}>
                 <option value='mainnet'>Mainnet</option>
                 <option value='devnet'>Devnet</option>
               </select>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={getInfo}>
            Get Updated Info
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
