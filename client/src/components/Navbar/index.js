import React from "react";
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink,
} from "./NavbarElements";

const Navbar = (props) => {
  let button;
  if (props.loginState != null) {
    button = <NavBtnLink to="/signin">Wallet Connected</NavBtnLink>;
  } else {
    button = <NavBtnLink to="/signin"> Connect Wallet</NavBtnLink>;
  }

  return (
    <>
      <Nav>
        <NavLink to="/">
          {/* <img src={require("../../logo.svg")} alt="logo" /> */}
          Global Image Registry
        </NavLink>
        <Bars />
        <NavMenu>
          {/* <NavLink to="/about" activeStyle>
            About
          </NavLink> */}
          {/* <NavLink to="/services" activeStyle>
            Services
          </NavLink>
          <NavLink to="/contact-us" activeStyle>
            Contact Us
          </NavLink>
          <NavLink to="/sign-up" activeStyle>
            Sign Up
          </NavLink> */}
          {/* Second Nav */}
          {/* <NavBtnLink to='/sign-in'>Sign In</NavBtnLink> */}
        </NavMenu>

        <NavBtn>
          {/* <NavBtnLink to="/signin">Connect Wallet</NavBtnLink> */}
          {button}
        </NavBtn>

        <NavBtn>
          <NavBtnLink to="/submit">Submit a Photo</NavBtnLink>
        </NavBtn>
      </Nav>
    </>
  );
};

export default Navbar;
