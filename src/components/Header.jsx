import { NavLink } from "react-router-dom";
import Button from "./Button";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { logoutUser } from "../services/auth.service";

export default function Header () {
    const { user, userData, setAppState } = useContext(AppContext);

    const logout = async () => {
        await logoutUser();
        setAppState({ user: null, userData: null})
    };

    return (
        <header className="bg-primary-800 text-white py-4">
            <div className="container mx-auto flex justify-between items-center">
                <NavLink to="/" className="text-lg font-semibold">Home</NavLink>
                { user 
                ? (
                    <div className="flex items-center space-x-4">
                        <span>{`Welcome, ${userData ? userData.handle : 'Loading'}`}</span>
                        <Button onClick={logout} className="btn btn-secondary">LogOut</Button>
                    </div>
                )
                : (
                    <div>
                        <NavLink to="/login" className="btn btn-primary">Login</NavLink>
                        <NavLink to="/register" className="btn btn-primary">Register</NavLink>
                    </div>
                )}
            </div>
        </header>
    )
}
