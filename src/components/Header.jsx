import { useContext } from "react";
import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
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
        <NavLink to="/" className="btn btn-ghost normal-case text-xl ml-14">
          Home
        </NavLink>
      </div>
      <div className="flex-none">
        {user ? (
          <>
            {userData?.avatar && (
              <img
                src={userData.avatar}
                alt="Avatar"
                className="w-10 h-10 rounded-full mr-4"
              />
            )}
            <span className="mr-4 text-lg">
              {`Welcome, ${userData ? userData.handle : "Loading"}`}
            </span>
            <NavLink
              to={`/profile/${userData ? userData.handle : ""}`}
              className="btn btn-ghost normal-case text-xl"
            >
              Profile
            </NavLink>
            <NavLink
              onClick={logout}
              className="btn btn-ghost normal-case text-xl"
            >
              Logout
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/login" className="btn btn-ghost normal-case text-xl">
              Login
            </NavLink>
            <NavLink
              to="/register"
              className="btn btn-ghost normal-case text-xl"
            >
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
