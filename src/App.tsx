import "./App.css";
import { useState } from "react";
import { Stack, Button ,Typography } from "@mui/material";
import WalletComp from "./components/WalletComp";

function App() {
  const [active, setActive] = useState(false);

  return (
    <>
      <Stack
        sx={{
          textAlign: "center",
        }}
        gap={3}
        padding={4}
      >
        <Typography variant="h3" fontWeight='bold'>Create Your Web Wallet  On One Click</Typography>
        {active ? (
          <WalletComp />
        ) : (
          <Button onClick={() => setActive((prev) => !prev)} sx={{
            width:'fit-content',
            margin:'auto',
            backgroundColor:'black',
            color:'white'
          }}>
            Get Started
          </Button>
        )}
      </Stack>
    </>
  );
}

export default App;
