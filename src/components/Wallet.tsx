import React ,{useState} from "react";
import { Stack, Typography, IconButton, Tooltip } from "@mui/material";
import { derivationPathType } from "./types";
import DeleteIcon from "@mui/icons-material/Delete";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import WalletInfo from "./WalletInfo";

const Wallet = ({
    wallet,
    handleClickOpen,
}: {
    wallet: derivationPathType;
    handleClickOpen: any;
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [open, setOpen] = useState(false);

    const handleClickShowPassword = (event:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        setShowPassword((show) => !show);
    };
    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
    };

    const viewWalletInfo = () => {
        setOpen(false);
        setOpen(true);
    };

    console.log('open: ',open);
    return (
       <>
        <Tooltip title="Click Wallet to know more !" placement="bottom">
           <Stack
                key={wallet.publicKey}
                sx={{
                    border: "1px solid grey",
                    borderRadius: "10px",
                    padding: "1rem",
                    cursor: "pointer",
                    backgroundColor: "#121111",
                    "&:hover": {
                        border: "1px solid white",
                        boxShadow: "1px 1px 3px white",
                        //   transform:'translate(-10px,-10px) ',
                        transition: "transform .3s linear",
                    },
                    ":active": {
                        backgroundColor: "#241d1d",
                    },
                }}
                gap={2}
                onClick={viewWalletInfo}
            >
                <Stack
                    direction="row"
                    sx={{
                        justifyContent: "space-between",
                    }}
                >
                    <Stack
                        direction="row"
                        sx={{
                            alignItems: "center",
                            cursor: "pointer",
                            padding: "0.5rem",
                            borderRadius: "10px",
                        }}
                        gap={2}
                    >
                        <img src={wallet.image} className="icon" />
                        <Typography variant="h4">{wallet.name}</Typography>
                    </Stack>
                    <IconButton
                        aria-label="delete"
                        color="error"
                        onClick={(event) =>{
                            event.stopPropagation();
                            handleClickOpen(wallet)
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Stack>
                <Stack gap={2}>
                    <Stack sx={{ textAlign: "left" }}>
                        <Typography variant="h5" sx={{ color: "yellow" }}>
                            Public key:
                        </Typography>
                        <Typography>{wallet.publicKey}</Typography>
                    </Stack>
                    <Stack sx={{ textAlign: "left" }}>
                        <Typography variant="h5" sx={{ color: "yellow" }}>
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
                                    color: "white",
                                }}
                            // sx={{
                            //   width:'94%',
                            //   border:'none',
                            //   outline:'none',
                            //   color:'white',
                            //   "*:focus":{
                            //     outline:'none'
                            //   }

                            // }}
                            />
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                sx={{ color: "white" }}
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>          
        </Tooltip>
        <WalletInfo open={open} setOpen={setOpen} wallet={wallet}/>
       </>
    );
};

export default Wallet;
