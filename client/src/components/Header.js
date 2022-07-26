import * as React from "react";
import PropTypes from "prop-types";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import BasicModal from "./BasicModal";
import ImageUploadComponent from "./ImageUploadComponent";
// import { Modal } from "@mui/material";

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
      <BasicModal buttonType="outlined" name="Upload an Image" Component={<ImageUploadComponent  state={props.state} setState={props.setState}/>} title="Upload an Image to the Ethereum Blockchain"/>
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
        {/* <Button size="small">GIR</Button> */}
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
        {/* <IconButton>
          <SearchIcon />
        </IconButton> */}
        {upLoadButton}

        {walletButton}
      </Toolbar>
      {/* <Toolbar
        component="nav"
        variant="dense"
        sx={{ justifyContent: "space-between", overflowX: "auto" }}
      >
        {sections.map((section) => (
          <Link
            color="inherit"
            noWrap
            key={section.title}
            variant="body2"
            href={section.url}
            sx={{ p: 1, flexShrink: 0 }}
          >
            {section.title}
          </Link>
        ))}
      </Toolbar> */}
    </React.Fragment>
  );
}

Header.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ).isRequired,
  title: PropTypes.string.isRequired,
};

export default Header;
