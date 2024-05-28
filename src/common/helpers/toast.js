import { Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DARK_THEME } from "../constants";
import { toast } from "react-toastify";

export const DARK_TOAST = {
  position: "bottom-right",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
  transition: Bounce,
};

export const LIGHT_TOAST = {
  position: "bottom-right",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
  transition: Bounce,
};

export const themeChecker = (text) => {
  const theme = localStorage.getItem("theme");

  if (theme === DARK_THEME) {
    toast(text, DARK_TOAST);
  } else {
    toast(text, LIGHT_TOAST);
  }
};
