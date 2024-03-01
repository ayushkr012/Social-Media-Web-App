import React from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Search,
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
} from "@mui/icons-material";

// useDispatch is a hook provided by the React Redux library that allows you to dispatch actions to the Redux store.
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";

export default function Navbar() {
  return <div>Navbar</div>;
}


/*

In Material-UI, the sx prop is a shorthand for defining inline styles using the Styled System library



*/