import React, { useState, useEffect } from "react";
import {
  Stack,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Button,
  Box,
  Grid,
  Dialog,
  Slide,
  DialogTitle,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
} from "@mui/material";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";
import { Keypair } from "@solana/web3.js";
import solana from "../assets/solana.svg";
import ethereum from "../assets/ethereum.png";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { derivationPathType } from "./types";
import Wallet from "./Wallet";
import { TransitionProps } from "@mui/material/transitions";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const firstTimeSteps = [
  "Your Secret Phrase",
  "Choose Blockchain",
  "Your Wallet Keys",
];

const WalletComp = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [mnemonics, setMnemonics] = useState<string>("");
  const [inputMnemonicsCode, setInputMnemonicsCode] = useState<string>("");

  const [currentSupportedBlockchain, setCurrentSupportedBlockchain] = useState<
    derivationPathType[]
  >([
    {
      name: "Solana",
      derviationPath: `m/44'/501'`,
      image: `${solana}`,
      selected: false,
      sign: "sol",
    },
    {
      name: "Ethereum",
      derviationPath: `m/44'/60'`,
      image: `${ethereum}`,
      selected: false,
      sign: "eth",
    },
  ]);

  const [currentDerivationPathsWallet, setCurrentDerivationPathsWallet] =
    useState<derivationPathType[]>([]);

  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const [addInputMnemonicsCode, setAddInputMnemonicsCode] =
    useState<boolean>(false);

  const [deleteWalletInfo, setDeleteWalletInfo] = useState<
    derivationPathType | undefined
  >(undefined);

  

  useEffect(() => {
    const seed = localStorage.getItem("seed");
    const prevSelectedBlockchain=localStorage.getItem('selectedBlockchain');
    if (seed && prevSelectedBlockchain) {
      setActiveStep(2);
      setCurrentSupportedBlockchain(JSON.parse(prevSelectedBlockchain));
    }
    const mnemonicCodes = generateMnemonic(128);
    setMnemonics(mnemonicCodes);
  }, []);

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  const handleNext = () => {
    if (activeStep < firstTimeSteps.length) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleClickOpen = (wallet: derivationPathType) => {
    setOpen(true);
    setDeleteWalletInfo(wallet);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange =
    (panel: string) => ( isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const selectBlockchain = (blockchain: derivationPathType) => {
    console.log("selectBlockchain: ", blockchain);
    const updatedCurrentSupportedBlockchain= currentSupportedBlockchain.map((obj) => {
      if (obj.name === blockchain.name) {
        obj.selected = !obj.selected;
      }
      return obj;
    })
    localStorage.setItem('selectedBlockchain',JSON.stringify(updatedCurrentSupportedBlockchain));
    setCurrentSupportedBlockchain(
      updatedCurrentSupportedBlockchain
    );
  };

  const createWallet = () => {
    
    const prevSelectedBlockchainData=localStorage.getItem('selectedBlockchain');
    let prevSelectedBlockchain:derivationPathType[]=[];
    if(prevSelectedBlockchainData){
      prevSelectedBlockchain=JSON.parse(prevSelectedBlockchainData);
    }
    
    // for solana  ---
    let selectedBlockchain:derivationPathType[]=prevSelectedBlockchain?.length>0?prevSelectedBlockchain:currentSupportedBlockchain;
    const solanaSelected = selectedBlockchain?.find(
      (blockchain) => blockchain.selected 
    );
    if (solanaSelected) {
      //checking if user has any mnemonics code ---
      if (
        addInputMnemonicsCode &&
        inputMnemonicsCode &&
        inputMnemonicsCode.split(" ").length < 12
      ) {
        alert("Please write correct secret phrase !");
        return;
      }
      let seed;
      let mnemonicsCode;
      const prevSeed = localStorage.getItem("seed");
      if (prevSeed) {
        seed = JSON.parse(prevSeed).data;

      } else {
        mnemonicsCode = inputMnemonicsCode ? inputMnemonicsCode : mnemonics;
        seed = mnemonicToSeedSync(mnemonicsCode);
        localStorage.setItem("seed", JSON.stringify(seed));
      }
      const index = currentDerivationPathsWallet?.filter(
        (blockchain) => blockchain.name === "Solana"
      )?.length;
      const solanaPath = `${solanaSelected.derviationPath}/${index}'/0'`;
      const derivedPathSeed = derivePath(solanaPath, seed.toString("hex")).key;
      const secret = nacl.sign.keyPair.fromSeed(derivedPathSeed).secretKey;
      const publicKey = Keypair.fromSecretKey(secret).publicKey.toBase58();
      const privateKey = Keypair.fromSecretKey(secret).secretKey;
      const currentDerivationPath = {
        ...solanaSelected,
        derviationPath: solanaPath,
        publicKey,
        privateKey,
      };
      setCurrentDerivationPathsWallet([
        ...currentDerivationPathsWallet,
        currentDerivationPath,
      ]);
    }
    // for ethereum -----
  };

  const deleteWallet = () => {
    const updatedCurrentDerivationPathsWallet =
      currentDerivationPathsWallet.filter(
        (elm) => elm.publicKey !== deleteWalletInfo?.publicKey
      );
    setCurrentDerivationPathsWallet(updatedCurrentDerivationPathsWallet);
  };

  //  steps -----------
  const step0 = () => {
    return (
      <Stack sx={{ minHeight: "300px" }}>
        <h1>Write or Generate Secret phrase</h1>
        <Accordion
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}
          sx={{
            backgroundColor: "#121111",
            color: "white",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography sx={{ width: "100%" }}>
              Write Your Secret Phrase
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              fullWidth
              placeholder="Please write your 12 word secret phrase"
              sx={{
                color: "white",
                border: "1px solid white",
                "& :focus": {
                  border: "none",
                },
              }}
              InputProps={{
                sx: {
                  "& input": {
                    color: "white",
                  },
                  "&:focus": {
                    border: "none",
                  },
                },
              }}
              value={inputMnemonicsCode}
              onChange={(event) => setInputMnemonicsCode(event?.target?.value)}
            />
            <Stack direction="row" gap={2} padding={2}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                  border: "1px solid purple",
                  backgroundColor: "purple",
                  color: "white",
                  "&:hover": {
                    border: "1px solid purple",
                    backgroundColor: "purple",
                    color: "white",
                  },
                }}
                onClick={() => setAddInputMnemonicsCode(true)}
              >
                Add
              </Button>
              <Button
                variant="contained"
                startIcon={<DeleteIcon />}
                onClick={() => {
                  setAddInputMnemonicsCode(false);
                  setInputMnemonicsCode("");
                }}
              >
                Clear
              </Button>
            </Stack>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel2"}
          onChange={handleChange("panel2")}
          sx={{
            backgroundColor: "#1c1a1a",
            color: "white",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2bh-content"
            id="panel2bh-header"
          >
            <Typography sx={{ width: "100%" }}>
              Generate New Secret Phrase
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ backgroundColor: "transparent" }}>
            <Grid container>
              {mnemonics?.split(" ")?.map((code) => {
                return (
                  <Grid
                    key={code}
                    item
                    xs={3}
                    rowSpacing={1}
                    columnSpacing={2}
                    sx={{
                      border: "1px solid white",
                      padding: "1rem",
                      color: "white",
                    }}
                  >
                    {code}
                  </Grid>
                );
              })}
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Stack>
    );
  };

  const step1 = () => {
    return (
      <Stack sx={{ minHeight: "300px" }} gap={4}>
        <h1>Please Select Blockchain</h1>
        <Stack direction="row" sx={{ justifyContent: "space-around" }}>
          {currentSupportedBlockchain?.map((blockchain) => {
            return (
              <Stack
                key={blockchain.name}
                direction="row"
                gap={2}
                sx={{
                  alignItems: "center",
                  cursor: "pointer",
                  padding: "0.5rem",
                  borderRadius: "10px",
                  border: "1px solid grey",
                  backgroundColor: blockchain.selected ? "green" : "",
                  "&:hover": {
                    border: "1px solid white",
                  },
                  "&:active": {
                    backgroundColor: "green",
                  },
                }}
                onClick={() => selectBlockchain(blockchain)}
              >
                <img src={blockchain.image} className="icon" />
                <Typography variant="h4">{blockchain.name}</Typography>
              </Stack>
            );
          })}
        </Stack>
      </Stack>
    );
  };

  const step2 = () => {
    return (
      <Stack gap={2} sx={{ minHeight: "300px" }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            maxWidth: "fit-content",
            margin: "1rem auto",
            backgroundColor: "purple",
            "&:hover": {
              backgroundColor: "purple",
            },
          }}
          onClick={()=>{
            createWallet()
          }}
        >
          Create Your Wallet
        </Button>
        <Stack
          sx={{
            maxHeight: "50vh",
            overflowY: "auto",
          }}
          gap={4}
        >
          {currentDerivationPathsWallet
            .filter((blockchain) => blockchain.name === "Solana")
            ?.map((wallet) => {
              return (
                <Wallet
                  wallet={wallet}
                  key={wallet.publicKey}
                  handleClickOpen={handleClickOpen}
                />
              );
            })}
        </Stack>
      </Stack>
    );
  };

  const confirmToDelete = () => {
    return (
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle
          sx={{
            backgroundColor: "#215685",
            color: "white",
            border: "1px solid white",
            borderBottom: "none",
          }}
        >
          {"Do you really want to delete the wallet ?"}
        </DialogTitle>
        <DialogActions
          sx={{
            backgroundColor: "#242424",
            border: "1px solid white",
            borderTop: "none",
          }}
        >
          <Button
            onClick={() => {
              setOpen(false);
              deleteWallet();
            }}
            sx={{ color: "white" }}
          >
            Yes
          </Button>
          <Button onClick={handleClose} sx={{ color: "white" }}>
            No
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  console.log(
    "currentStep: ",
    activeStep,
    mnemonics,
    currentSupportedBlockchain,
    currentDerivationPathsWallet,
    inputMnemonicsCode
  );

  return (
    <>
      <Stack spacing={3}>
        <Stepper nonLinear activeStep={activeStep}>
          {firstTimeSteps.map((label, index) => {
            return (
              <Step key={label}>
                <StepLabel
                  sx={
                    {
                      // border:'1px solid red'
                    }
                  }
                >
                  <Typography
                    sx={{ color: activeStep === index ? "white" : "" }}
                  >
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
        <>
          {activeStep === 0
            ? step0()
            : activeStep === 1
            ? step1()
            : activeStep === firstTimeSteps.length - 1
            ? step2()
            : ""}
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{
                mr: 1,
                backgroundColor: activeStep === 0 ? "transparent" : "white",
                color: "black",
                "&:hover": {
                  border: "1px solid white",
                  color: "white",
                },
              }}
              variant="outlined"
            >
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button
              onClick={handleNext}
              variant="outlined"
              disabled={activeStep === firstTimeSteps.length - 1}
              sx={{
                border: "1px solid purple",
                backgroundColor:
                  activeStep === firstTimeSteps.length - 1
                    ? "transparent"
                    : "purple",
                color: "white",
                "&:hover": {
                  border: "1px solid purple",
                  color: "white",
                },
              }}
            >
              {activeStep === firstTimeSteps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box>
        </>

        {confirmToDelete()}
      </Stack>
    </>
  );
};

export default WalletComp;
