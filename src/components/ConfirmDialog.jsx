import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Check, Uncheck } from "../common/helpers/icons";
import { DARK_THEME } from "../common/constants";

const showConfirmDialog = (message, onConfirm) => {
  const theme = localStorage.getItem("theme") === DARK_THEME ? "dark" : "light";

  const toastId = toast(
    () => (
      <div className="">
        <p className="flex justify-center">{message}</p>
        <div className="inline-flex justify-items-center">
          <button
            onClick={() => {
              onConfirm();
              toast.dismiss(toastId);
            }}
            className="btn btn-success w-32"
          >
            <Check />
          </button>
          <button
            onClick={() => toast.dismiss(toastId)}
            className="btn btn-error w-32"
          >
            <Uncheck />
          </button>
        </div>
      </div>
    ),
    {
      position: "top-center",
      autoClose: 10000,
      closeOnClick: false,
      draggable: false,
      theme: theme,
    }
  );

  return toastId;
};

export default showConfirmDialog;
