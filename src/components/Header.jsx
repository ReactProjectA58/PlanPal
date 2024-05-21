import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Button from "./Button";
import { AppContext } from "../context/AppContext";
import { logoutUser } from "../services/auth.service";
import { DARK_THEME, LIGHT_THEME } from "../common/constants";
import { Moon, Sun } from "../common/helpers/icons";

export default function Header() {
  const { user, userData, setAppState } = useContext(AppContext);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : LIGHT_THEME
  );

  const handleToggle = (e) => {
    e.target.checked ? setTheme(DARK_THEME) : setTheme(LIGHT_THEME);
  };

  useEffect(() => {
    localStorage.setItem("theme", theme);
    const localTheme = localStorage.getItem("theme");
    document.querySelector("html").setAttribute("data-theme", localTheme);
  }, [theme]);
  const logout = async () => {
    await logoutUser();
    setAppState({ user: null, userData: null });
  };

  return (
    <header className="navbar bg-base-100 shadow-md">
      <div className="flex-1">
        <NavLink
          to="/"
          className="btn btn-ghost normal-case text-xl relative left-14"
        >
          Home
        </NavLink>
      </div>
      <div className="flex-none">
        {user ? (
          <>
            <span className="mr-4 text-lg">
              {`Welcome, ${userData ? userData.handle : "Loading"}`}
            </span>
            <Button onClick={logout} className="btn btn-primary">
              LogOut
            </Button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="btn btn-ghost">
              Login
            </NavLink>
            <NavLink to="/register" className="btn btn-ghost">
              Register
            </NavLink>
          </>
        )}
        <label className="swap swap-rotate">
          <input type="checkbox" onChange={handleToggle} />

          <Sun />
          <Moon />
        </label>
      </div>
    </header>
  );
}
