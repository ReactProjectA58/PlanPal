import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import Button from "./Button";
import { AppContext } from "../context/AppContext";
import { logoutUser } from "../services/auth.service";

export default function Header() {
  const { user, userData, setAppState } = useContext(AppContext);

  const logout = async () => {
    await logoutUser();
    setAppState({ user: null, userData: null });
  };

  return (
    <header className="navbar bg-base-100 shadow-md">
      <div className="flex-1">
        <NavLink to="/" className="btn btn-ghost normal-case text-xl">Home</NavLink>
      </div>
      <div className="flex-none">
        {user ? (
          <>
            <span className="mr-4 text-lg">
              {`Welcome, ${userData ? userData.handle : 'Loading'}`}
            </span>
            <Button onClick={logout} className="btn btn-primary">LogOut</Button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="btn btn-ghost">Login</NavLink>
            <NavLink to="/register" className="btn btn-ghost">Register</NavLink>
          </>
        )}
      </div>
    </header>
  );
}
