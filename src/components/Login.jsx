import { useContext, useEffect, useState } from "react";
import Button from "../components/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { loginUser } from "../services/auth.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";   
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"; // Import icons directly

export default function Login() {
    const { user, setAppState } = useContext(AppContext);
    const [form, setForm] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (user) {
            navigate(location.state?.from.pathname || '/');
        }
    }, [user, navigate, location.state]);

    const login = async () => {
        setError(''); 

        if (!form.email || !form.password) {
            setError('Email and password are required');
            return;
        }

        const response = await loginUser(form.email, form.password);
        if (response.error) {
            setError(response.error);
        } else {
            setAppState({ user: response.user, userData: null });
            navigate(location.state?.from.pathname || '/events');
        }
    };

    const updateForm = prop => e => {
        setForm({
            ...form,
            [prop]: e.target.value,
        });
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-semibold mb-4">Login</h1>
            <div className="flex flex-col space-y-2">
                <label htmlFor="email" className="text-lg">Email </label>
                <input 
                    placeholder="Enter Your Email"
                    value={form.email} 
                    onChange={updateForm('email')} 
                    type="text" 
                    name="email" 
                    id="email" 
                    className="input input-bordered"
                />
                <label htmlFor="password" className="text-lg">Password </label>
                <div className="relative">
                    <input 
                        placeholder="Enter Your Password"
                        value={form.password} 
                        onChange={updateForm('password')} 
                        type={showPassword ? "text" : "password"} 
                        name="password" 
                        id="password" 
                        className="input input-bordered w-full"
                    />
                    <button
                        type="button"
                        onClick={toggleShowPassword}
                        className="absolute right-2 top-2"
                    >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                </div>
            </div>
            {error && <div className="text-red-500 mt-2">{error}</div>}
            <Button onClick={login} className="btn btn-primary mt-4">Login</Button>
        </div>
    );
}
