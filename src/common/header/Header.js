import React, { Component } from "react";
import "./Header.css";
import { withRouter } from "react-router-dom";
import Fastfood from "@material-ui/icons/Fastfood";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Button from "@material-ui/core/Button";
import Search from "@material-ui/icons/Search";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import Typography from "@material-ui/core/Typography";
import Modal from "react-modal";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PropTypes from "prop-types";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { Link } from "react-router-dom";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const TabContainer = (props) => {
  return (
    <Typography component="div" style={{ padding: "0px", textAlign: "center" }}>
      {props.children}
    </Typography>
  );
};

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      value: 0,
      loginContactNumberRequired: "dispNone",
      loginContactNumber: "",
      loginContactError: "",
      loginPasswordRequired: "dispNone",
      loginPassword: "",
      loginPasswordError: "",
      firstNameRequired: "dispNone",
      firstName: "",
      lastName: "",
      emailRequired: "dispNone",
      email: "",
      emailError: "",
      signupPasswordRequired: "dispNone",
      signupPassword: "",
      signupPasswordError: "",
      signupContactNumberRequired: "dispNone",
      signupContactNumber: "",
      signupContactNumberError: "",
      snackBarOpen: false,
      snackBarMessage: "",
      loggedIn: sessionStorage.getItem("access-token") === null ? false : true,
      loggedInCustomerFirstName: sessionStorage.getItem("customer-name"),
      anchorE1: null,
    };
  }

  openModalHandler = () => {
    this.setState({
      modalIsOpen: true,
      value: 0,
    });
  };

  closeModalHandler = () => {
    this.setState({
      modalIsOpen: false,
      value: 0,
      loginContactNumberRequired: "dispNone",
      loginContactNumber: "",
      loginContactError: "",
      loginPasswordRequired: "dispNone",
      loginPassword: "",
      loginPasswordError: "",
      firstNameRequired: "dispNone",
      firstName: "",
      lastName: "",
      emailRequired: "dispNone",
      email: "",
      emailError: "",
      signupPasswordRequired: "dispNone",
      signupPassword: "",
      signupPasswordError: "",
      signupContactNumberRequired: "dispNone",
      signupContactNumber: "",
      signupContactNumberError: "",
    });
  };

  tabChangeHandler = (event, value) => {
    this.setState({
      value,
    });
  };

  loginClickHandler = () => {
    this.state.loginContactNumber === ""
      ? this.setState({ loginContactNumberRequired: "dispBlock" })
      : this.setState({ loginContactNumberRequired: "dispNone" });
    this.state.loginPassword === ""
      ? this.setState({ loginPasswordRequired: "dispBlock" })
      : this.setState({ loginPasswordRequired: "dispNone" });

    // login contact number validation
    if (this.state.loginContactNumber === "") {
      this.setState({
        loginContactNumberRequired: "dispBlock",
        loginContactError: "required",
      });
    } else if (
      this.state.loginContactNumber.toString().match(/^(?=.*\d).{10,10}$/i) ===
      null
    ) {
      this.setState({ loginContactNumberRequired: "dispBlock" });
      this.setState({
        loginContactError: "Invalid Contact",
      });
    } else {
      this.setState({ loginContactNumberRequired: "dispNone" });
      this.setState({ loginContactError: "" });
    }

    //login password validation
    if (this.state.loginPassword === "") {
      this.setState({
        loginPasswordRequired: "dispBlock",
        loginPasswordError: "required",
      });
    } else {
      this.setState({
        loginPasswordRequired: "dispNone",
        loginPasswordError: "",
      });
    }

    if (
      this.state.loginContactNumber === "" ||
      this.state.loginPassword === ""
    ) {
      return;
    }

    //xhr request for login
    let dataLogin = null;
    let xhrLogin = new XMLHttpRequest();
    let that = this;
    xhrLogin.addEventListener("readystatechange", function() {
      if (this.readyState === 4) {
        if (xhrLogin.status === 200 || xhrLogin.status === 201) {
          let loginResponse = JSON.parse(this.responseText);
          sessionStorage.setItem("uuid", JSON.parse(this.responseText).id);
          sessionStorage.setItem(
            "access-token",
            xhrLogin.getResponseHeader("access-token")
          );
          sessionStorage.setItem("customer-name", loginResponse.first_name);
          that.setState({
            loggedIn: true,
            loggedInCustomerFirstName: loginResponse.first_name,
          });
          that.snackBarHandler("Logged in successfully!");
          that.closeModalHandler();
        } else {
          that.setState({ loginPasswordRequired: "dispBlock" });
          that.setState({
            loginPasswordError: JSON.parse(this.responseText).message,
          });
        }
      }
    });

    xhrLogin.open("POST", this.props.baseUrl + "customer/login");
    xhrLogin.setRequestHeader(
      "Authorization",
      "Basic " +
        window.btoa(
          this.state.loginContactNumber + ":" + this.state.loginPassword
        )
    );
    xhrLogin.setRequestHeader("Content-Type", "application/json");
    xhrLogin.setRequestHeader("Cache-Control", "no-cache");
    xhrLogin.send(dataLogin);
  };

  loginContactNumberChangeHandler = (e) => {
    this.setState({ loginContactNumber: e.target.value });
  };

  loginPasswordChangeHandler = (e) => {
    this.setState({ loginPassword: e.target.value });
  };

  signUpClickHandler = () => {
    this.state.firstName === ""
      ? this.setState({ firstNameRequired: "dispBlock" })
      : this.setState({ firstNameRequired: "dispNone" });
    this.state.email === ""
      ? this.setState({ emailRequired: "dispBlock" })
      : this.setState({ emailRequired: "dispNone" });
    this.state.signupPassword === ""
      ? this.setState({ signupPasswordRequired: "dispBlock" })
      : this.setState({ signupPasswordRequired: "dispNone" });
    this.state.signupContactNumber === ""
      ? this.setState({ signupContactNumberRequired: "dispBlock" })
      : this.setState({ signupContactNumberRequired: "dispNone" });

    //email validation
    if (this.state.email === "") {
      this.setState({
        emailRequired: "dispBlock",
        emailError: "required",
      });
    } else if (
      this.state.email
        .toString()
        .match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) === null
    ) {
      this.setState({ emailRequired: "dispBlock" });
      this.setState({ emailError: "Invalid Email" });
    } else {
      this.setState({ emailRequired: "dispNone" });
      this.setState({ emailError: "" });
    }

    //password validation
    if (this.state.signupPassword === "") {
      this.setState({ signupPasswordRequired: "dispBlock" });
      this.setState({ signupPasswordError: "required" });
    } else if (
      this.state.signupPassword
        .toString()
        .match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,32}$/i) === null
    ) {
      this.setState({ signupPasswordRequired: "dispBlock" });
      this.setState({
        signupPasswordError:
          "Password must contain at least one capital letter, one small letter, one number, and one special character",
      });
    } else {
      this.setState({ signupPasswordRequired: "dispNone" });
      this.setState({ signupPasswordError: "" });
    }

    //contact number validation
    if (this.state.signupContactNumber === "") {
      this.setState({ signupContactNumberRequired: "dispBlock" });
      this.setState({ signupContactNumberError: "required" });
      return;
    } else if (
      this.state.signupContactNumber.toString().match(/^(?=.*\d).{10,10}$/i) ===
      null
    ) {
      this.setState({ signupContactNumberRequired: "dispBlock" });
      this.setState({
        signupContactNumberError:
          "Contact No. must contain only numbers and must be 10 digits long",
      });
    } else {
      this.setState({ signupContactNumberRequired: "dispNone" });
      this.setState({ signupContactNumberError: "" });
    }

    if (
      this.state.email === "" ||
      this.state.firstName === "" ||
      this.state.lastName === "" ||
      this.state.signupContactNumber === "" ||
      this.state.signupPassword === ""
    ) {
      return;
    }

    //xhr request for signup

    let dataSignup = JSON.stringify({
      contact_number: this.state.signupContactNumber,
      email_address: this.state.email,
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      password: this.state.signupPassword,
    });

    let xhrSignup = new XMLHttpRequest();
    let that = this;
    xhrSignup.addEventListener("readystatechange", function() {
      if (this.readyState === 4) {
        if (xhrSignup.status === 200 || xhrSignup.status === 201) {
          that.snackBarHandler("Registered successfully! Please login now!");
          that.openModalHandler();
        } else {
          that.setState({ signupContactNumberRequired: "dispBlock" });
          that.setState({
            signupContactNumberError: JSON.parse(this.responseText).message,
          });
        }
      }
    });

    xhrSignup.open("POST", this.props.baseUrl + "customer/signup");
    xhrSignup.setRequestHeader("Content-Type", "application/json");
    xhrSignup.setRequestHeader("Cache-Control", "no-cache");
    xhrSignup.send(dataSignup);
  };

  firstNameChangeHandler = (e) => {
    this.setState({ firstName: e.target.value });
  };

  lastNameChangeHandler = (e) => {
    this.setState({ lastName: e.target.value });
  };

  emailChangeHandler = (e) => {
    this.setState({ email: e.target.value });
  };

  signupPasswordChangeHandler = (e) => {
    this.setState({ signupPassword: e.target.value });
  };

  signupContactNumberChangeHandler = (e) => {
    this.setState({ signupContactNumber: e.target.value });
  };

  snackBarHandler = (message) => {
    // if any snackbar open already close that
    this.setState({ snackBarOpen: false });
    // updating component state snackbar message
    this.setState({ snackBarMessage: message });
    // Show snackbar
    this.setState({ snackBarOpen: true });
  };

  handleMenu = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleProfileMenuClick = () => {
    this.setState({ anchorEl: null });
  };

  handleLogoutMenuClick = () => {
    this.setState({ anchorEl: null });

    //xhr for logout
    let logoutData = null;
    let that = this;
    let xhrLogout = new XMLHttpRequest();
    xhrLogout.addEventListener("readystatechange", function() {
      if (xhrLogout.readyState === 4 && xhrLogout.status === 200) {
        sessionStorage.removeItem("uuid");
        sessionStorage.removeItem("access-token");
        sessionStorage.removeItem("customer-name");
        that.setState({
          ...that.state,
          loggedIn: false,
        });
      }
    });

    xhrLogout.open("POST", this.props.baseUrl + "customer/logout");
    xhrLogout.setRequestHeader(
      "authorization",
      "Bearer " + sessionStorage.getItem("access-token")
    );
    xhrLogout.send(logoutData);
  };

  inputSearchChangeHandler = (event) => {
    let searchOn = true;
    if (!(event.target.value === "")) {
      let dataRestaurant = null;
      let that = this;
      let xhrSearchRestaurant = new XMLHttpRequest();

      xhrSearchRestaurant.addEventListener("readystatechange", function() {
        if (
          xhrSearchRestaurant.readyState === 4 &&
          xhrSearchRestaurant.status === 200
        ) {
          var restaurant = JSON.parse(this.responseText).restaurants;
          that.props.updateSearchRestaurant(restaurant, searchOn);
        }
      });

      xhrSearchRestaurant.open(
        "GET",
        this.props.baseUrl + "restaurant/name/" + event.target.value
      );
      xhrSearchRestaurant.setRequestHeader("Content-Type", "application/json");
      xhrSearchRestaurant.setRequestHeader("Cache-Control", "no-cache");
      xhrSearchRestaurant.send(dataRestaurant);
    } else {
      let restaurant = [];
      searchOn = false;
      this.props.updateSearchRestaurant(restaurant, searchOn);
    }
  };

  render() {
    return (
      <div>
        <header className="app-header">
          <div className="flex-container-header">
            <div className="app-logo">
              <Fastfood style={{ fontSize: "35px", color: "white" }} />
            </div>
            {this.props.homeOptions === "true" ? (
              <div className="app-search">
                <Typography variant="h6">
                  <Input
                    type="text"
                    placeholder="Search by Restaurant Name"
                    inputProps={{ "aria-label": "description" }}
                    style={{ color: "grey", width: 280 }}
                    startAdornment={
                      <InputAdornment position="start">
                        <Search style={{ color: "white" }} />
                      </InputAdornment>
                    }
                    onChange={this.inputSearchChangeHandler}
                  />
                </Typography>
              </div>
            ) : (
              ""
            )}
            <div className="app-login">
              {this.state.loggedIn ? (
                <div>
                  <Button
                    className="loggedInButton"
                    disableRipple={true}
                    variant="text"
                    aria-owns={this.state.anchorEl ? "simple-menu" : undefined}
                    aria-haspopup="true"
                    onClick={this.handleMenu}
                  >
                    <AccountCircle
                      style={{ marginRight: 4 }}
                      htmlColor="#c2c2c2"
                    />
                    {this.state.loggedInCustomerFirstName}
                  </Button>
                  <Menu
                    id="simple-menu"
                    anchorEl={this.state.anchorEl}
                    open={Boolean(this.state.anchorEl)}
                    onClose={this.handleClose}
                  >
                    <Link
                      to={"/profile"}
                      className="linkedPage"
                      underline="none"
                    >
                      <MenuItem
                        className="menu-item linkedPage"
                        disableGutters={false}
                        onClick={this.handleProfileMenuClick}
                      >
                        My Profile
                      </MenuItem>
                    </Link>
                    <MenuItem
                      className="menu-item"
                      onClick={this.handleLogoutMenuClick}
                    >
                      Logout
                    </MenuItem>
                  </Menu>
                </div>
              ) : (
                <Button
                  variant="contained"
                  color="default"
                  onClick={this.openModalHandler}
                >
                  <AccountCircle style={{ marginRight: 4 }} />
                  LOGIN
                </Button>
              )}
            </div>
          </div>
        </header>
        <Modal
          ariaHideApp={false}
          isOpen={this.state.modalIsOpen}
          contentLabel="Login"
          onRequestClose={this.closeModalHandler}
          style={customStyles}
        >
          <Tabs
            value={this.state.value}
            onChange={this.tabChangeHandler}
            className="tabs"
          >
            <Tab label="LOGIN" />
            <Tab label="SIGNUP" />
          </Tabs>
          {this.state.value === 0 && (
            <TabContainer>
              <FormControl required className="formControl">
                <InputLabel htmlFor="loginContactNumber">
                  Contact No.
                </InputLabel>
                <Input
                  id="loginContactNumber"
                  type="number"
                  logincontactnumber={this.state.loginContactNumber}
                  value={this.state.loginContactNumber}
                  onChange={this.loginContactNumberChangeHandler}
                  className="input-fields"
                  fullWidth={true}
                />
                <FormHelperText
                  className={this.state.loginContactNumberRequired}
                >
                  <span className="red">{this.state.loginContactError}</span>
                </FormHelperText>
              </FormControl>
              <br />
              <br />
              <FormControl required className="formControl">
                <InputLabel htmlFor="loginPassword">Password</InputLabel>
                <Input
                  id="loginPassword"
                  type="password"
                  loginpassword={this.state.loginPassword}
                  value={this.state.loginPassword}
                  onChange={this.loginPasswordChangeHandler}
                  className="input-fields"
                  fullWidth={true}
                />
                <FormHelperText className={this.state.loginPasswordRequired}>
                  <span className="red">{this.state.loginPasswordError}</span>
                </FormHelperText>
              </FormControl>
              <br />
              <br />
              <br />
              <br />
              <Button
                variant="contained"
                color="primary"
                onClick={this.loginClickHandler}
              >
                LOGIN
              </Button>
            </TabContainer>
          )}

          {this.state.value === 1 && (
            <TabContainer>
              <FormControl required className="formControl">
                <InputLabel htmlFor="firstName">First Name</InputLabel>
                <Input
                  id="firstName"
                  type="text"
                  firstname={this.state.firstName}
                  value={this.state.firstName}
                  onChange={this.firstNameChangeHandler}
                  className="input-fields"
                  fullWidth={true}
                />
                <FormHelperText className={this.state.firstNameRequired}>
                  <span className="red">required</span>
                </FormHelperText>
              </FormControl>
              <br />
              <br />
              <FormControl className="formControl">
                <InputLabel htmlFor="lastName">Last Name</InputLabel>
                <Input
                  id="lastName"
                  type="text"
                  lastname={this.state.lastName}
                  value={this.state.lastName}
                  onChange={this.lastNameChangeHandler}
                  className="input-fields"
                  fullWidth={true}
                />
              </FormControl>
              <br />
              <br />
              <FormControl required className="formControl">
                <InputLabel htmlFor="email">Email</InputLabel>
                <Input
                  id="email"
                  type="email"
                  email={this.state.email}
                  value={this.state.email}
                  onChange={this.emailChangeHandler}
                  className="input-fields"
                  fullWidth={true}
                />
                <FormHelperText className={this.state.emailRequired}>
                  <span className="red">{this.state.emailError}</span>
                </FormHelperText>
              </FormControl>
              <br />
              <br />
              <FormControl required className="formControl">
                <InputLabel htmlFor="signupPassword">Password</InputLabel>
                <Input
                  id="signupPassword"
                  type="password"
                  signuppassword={this.state.signupPassword}
                  value={this.state.signupPassword}
                  onChange={this.signupPasswordChangeHandler}
                  className="input-fields"
                  fullWidth={true}
                />
                <FormHelperText className={this.state.signupPasswordRequired}>
                  <span className="red">{this.state.signupPasswordError}</span>
                </FormHelperText>
              </FormControl>
              <br />
              <br />
              <FormControl required className="formControl">
                <InputLabel htmlFor="signupContactNumber">
                  Contact No.
                </InputLabel>
                <Input
                  id="signupContactNumber"
                  type="number"
                  signupcontactnumber={this.state.signupContactNumber}
                  value={this.state.signupContactNumber}
                  onChange={this.signupContactNumberChangeHandler}
                  className="input-fields"
                  fullWidth={true}
                />
                <FormHelperText
                  className={this.state.signupContactNumberRequired}
                >
                  <span className="red">
                    {this.state.signupContactNumberError}
                  </span>
                </FormHelperText>
              </FormControl>
              <br />
              <br />
              <br />
              <br />
              <Button
                variant="contained"
                color="primary"
                onClick={this.signUpClickHandler}
              >
                SIGNUP
              </Button>
            </TabContainer>
          )}
        </Modal>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={this.state.snackBarOpen}
          autoHideDuration={6000}
          onClose={() => this.setState({ snackBarOpen: false })}
          ContentProps={{
            "aria-describedby": "message-id",
          }}
          message={<span id="message-id">{this.state.snackBarMessage}</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={() => this.setState({ snackBarOpen: false })}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </div>
    );
  }
}

export default withRouter(Header);
