import * as React from "react";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import BasicModal from "./BasicModal";
import ImageUploadComponent from "./ImageUploadComponent";

function Header(props) {
  let walletButton;
  let upLoadButton;

  if (props.loginState != null) {
    walletButton = (
      <Button variant="outlined" size="small">
        Wallet Connected
      </Button>
    );
    upLoadButton = (
      <BasicModal
        buttonType="outlined"
        name="Upload an Image"
        Component={
          <ImageUploadComponent  
           state={props.state}
           setState={props.setState}
           />} 
        title="Upload an Image to the Ethereum Blockchain"
      />
    );
  } else {
    walletButton = (
      <Button variant="outlined" size="small">
        Connect Wallet
      </Button>
    );
  }

  return (
    <React.Fragment>
      <Toolbar sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          align="left"
          noWrap
          sx={{ flex: 1 }}
        >
          {"GIR"}
        </Typography>
        {upLoadButton}
        {walletButton}
      </Toolbar>
    </React.Fragment>
  );
}

export default Header;
