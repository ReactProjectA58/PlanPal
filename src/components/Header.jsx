import { useContext, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { logoutUser } from "../services/auth.service";
import { DARK_THEME, LIGHT_THEME } from "../common/constants";
import { Moon, Sun } from "../common/helpers/icons";
import SideBar from "./Sidebar/Sidebar";

export default function Header() {
  const { user, userData, setAppState } = useContext(AppContext);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : LIGHT_THEME
  );
  const location = useLocation();

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
    <div
      className={`navbar bg-base-300 min-w-full flex justify-between items-center ${
        location.pathname === "/" ? "fixed top-0 left-0 w-full z-50" : ""
      }`}
    >
      <div className="flex items-center">
        <SideBar />
        <NavLink to="/" className="btn btn-ghost normal-case text-xl">
          Home
        </NavLink>
      </div>

      <div className="flex items-center">
        {user ? (
          <>
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
            <NavLink
              to="/login"
              className="btn btn-ghost normal-case text-xl mr-4"
            >
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
        <label className="swap swap-rotate ml-4">
          <input
            type="checkbox"
            onChange={handleToggle}
            checked={theme === DARK_THEME}
          />
          <Sun />
          <Moon />
        </label>
      </div>
    </div>
  );
}
