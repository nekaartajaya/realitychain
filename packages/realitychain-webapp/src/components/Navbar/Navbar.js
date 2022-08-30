import BellIcon from "@heroicons/react/solid/BellIcon";
import UserCircleIcon from "@heroicons/react/solid/UserCircleIcon";
import LogoutIcon from "@heroicons/react/solid/LogoutIcon";

import React from "react";

import { ReactComponent as RealityChain } from "../../assets/logo.svg";

import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import SvgIcon from "@material-ui/core/SvgIcon";
import AppBar from "@material-ui/core/AppBar";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import { useNavigate, useLocation } from "react-router-dom";
import { useStyles } from "./navbar.style";

function a11yProps(index) {
  return {
    id: `nav-tab-${index}`,
    "aria-controls": `nav-tabpanel-${index}`,
  };
}

function LinkTab(props) {
  const style = useStyles();
  const navigate = useNavigate();
  return (
    <Tab
      component="a"
      className={style.tab}
      onClick={(event) => {
        event.preventDefault();
        navigate(props.href);
      }}
      {...props}
    />
  );
}

export const Navbar = ({ onConnect, balance, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const style = useStyles();
  const [value, setValue] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const paths = ["discover", "marketplace", "profile"];
    paths.forEach((path) => {
      const regex = new RegExp(`${path}`, "i");
      if (location.pathname.match(regex) !== null) {
        setValue(location.pathname.match(regex)[0]);
      }
    });
  }, [location]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleConnectWallet = () => {
    onConnect();
  };

  const handleTogleModal = () => {
    setOpen((open) => !open);
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar style={{ justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <IconButton
            onClick={() => navigate("/")}
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <SvgIcon
              component={RealityChain}
              viewBox="0 0 40 40"
              style={{ fontSize: 40 }}
            />
          </IconButton>
          <Typography
            variant="h4"
            style={{ fontWeight: 600, marginRight: 24, cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            REALITYCHAIN
          </Typography>
          <Tabs
            variant="fullWidth"
            value={value}
            onChange={handleChange}
            aria-label="nav tabs example"
            classes={{ root: style.tabs }}
          >
            <LinkTab
              label="DISCOVER"
              href="/discover"
              value={"discover"}
              {...a11yProps(0)}
            />
            {/* <LinkTab
              label="MY PROJECT"
              href="/project"
              value={"project"}
              {...a11yProps(4)}
            />
            <LinkTab
              label="SERIES"
              href="/series"
              value={"series"}
              {...a11yProps(1)}
            />
            <LinkTab
              label="MINTING"
              href="/minting"
              value={"minting"}
              {...a11yProps(2)}
            />
            <LinkTab
              label="STAKING"
              href="/staking"
              value={"staking"}
              {...a11yProps(3)}
            /> */}
            <LinkTab
              label="MARKETPLACE"
              href="/marketplace"
              value={"marketplace"}
              {...a11yProps(1)}
            />
            <LinkTab
              label="UTILITY NFT"
              href="/profile"
              value={"profile"}
              {...a11yProps(5)}
            />
          </Tabs>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {window.walletConnection.isSignedIn() ? (
            <ButtonGroup
              size="small"
              variant="outlined"
              color="primary"
              style={{ justifySelf: "flex-end" }}
            >
              <Button
                onClick={handleTogleModal}
                style={{
                  width: "auto",
                  color: "#B761C2",
                  borderRightColor: "transparent",
                  marginRight: -3,
                }}
              >
                {balance} REAL
              </Button>
              <Button
                onClick={handleTogleModal}
                style={{
                  width: "auto",
                  backgroundColor: "rgba(152, 22, 168, 0.15)",
                  borderLeftColor: "transparent",
                }}
              >
                {window.accountId}
              </Button>
            </ButtonGroup>
          ) : (
            <Button
              variant="contained"
              color="primary"
              style={{ width: "auto" }}
              onClick={handleConnectWallet}
            >
              Connect
            </Button>
          )}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <SvgIcon component={BellIcon} viewBox="0 0 20 20" />
          </IconButton>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => navigate("/profile")}
          >
            <SvgIcon component={UserCircleIcon} viewBox="0 0 20 20" />
          </IconButton>
        </div>
        <Dialog
          onClose={handleTogleModal}
          aria-labelledby="customized-dialog-title"
          open={open}
          maxWidth="xs"
        >
          <DialogTitle id="customized-dialog-title">Account</DialogTitle>
          <DialogContent>
            <div
              style={{
                background: "#2B3240",
                borderRadius: 8,
                padding: 24,
                width: 384,
              }}
            >
              <Typography variant="subtitle1" style={{ marginBottom: 8 }}>
                {window.accountId}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Balance
              </Typography>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <SvgIcon component={RealityChain} viewBox="0 0 40 40" />
                <Typography variant="subtitle1">{balance} REAL</Typography>
              </div>
            </div>
          </DialogContent>
          <DialogActions
            style={{ justifyContent: "flex-start", paddingLeft: 16 }}
          >
            <Button
              startIcon={<SvgIcon component={LogoutIcon} viewBox="0 0 20 20" />}
              variant="text"
              style={{ color: "#D391D6", width: "auto" }}
              onClick={onLogout}
            >
              Disconnect
            </Button>
          </DialogActions>
        </Dialog>
      </Toolbar>
    </AppBar>
  );
};
