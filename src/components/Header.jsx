import { useContext } from "react";
import { NavLink } from "react-router-dom";
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
        <NavLink
          to="/"
          className="btn btn-ghost normal-case text-xl ml-14"
        >
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
            <NavLink to={`/profile/${userData ? userData.handle : ''}`} className="btn btn-ghost normal-case text-xl">
              Profile
            </NavLink>
            <NavLink onClick={logout} className="btn btn-ghost normal-case text-xl">
              Logout
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/login" className="btn btn-ghost normal-case text-xl">
              Login
            </NavLink>
            <NavLink to="/register" className="btn btn-ghost normal-case text-xl">
              Register
            </NavLink>
          </>
        )}
      </div>
    </header>
  );
}
