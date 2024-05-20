import { useContext, useState, useEffect } from "react";
import { registerUser } from "../services/auth.service";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { createUserHandle, getUserByHandle } from "../services/users.service";
import Button from "./Button";
import { validateRegister } from "../common/helpers/validationHelpers";

export default function Register() {
  const [form, setForm] = useState({
    userName: "",
    email: "",
    password: "",
    repeatPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [errors, setErrors] = useState({}); // State to hold validation errors
  const { user, setAppState } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const updateForm = (prop) => (e) => {
    setForm({
      ...form,
      [prop]: e.target.value,
    });
  };

  const register = async () => {
    const validationErrors = await validateRegister(form); // Validate the form data
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Set validation errors
    } else {
      const credential = await registerUser(form.email, form.password);
      await createUserHandle(
        form.userName,
        credential.user.uid,
        credential.user.email,
        form.firstName,
        form.lastName,
        form.phone
      );
      setAppState({ user: credential.user, userData: null });
      navigate("/");
    }
  };

  return (
    <div className="container mx-auto">
    <h1 className="text-3xl font-semibold mb-4">Register</h1>
    <div className="flex flex-col space-y-2">
      <label htmlFor="userName" className="text-lg">
        Username:{" "}
      </label>
      <input
        placeholder="Username"
        value={form.userName}
        onChange={updateForm("userName")}
        type="text"
        id="userName"
        className={`input input-bordered ${
          errors.userName ? "border-red-500" : ""
        }`} // Add red border if there's an error
      />
      {errors.userName && <span className="text-red-500">{errors.userName}</span>}
      {/* Display error message */}
  
      {/* Email */}
      <label htmlFor="email" className="text-lg">
        Email:{" "}
      </label>
      <input
        placeholder="Email"
        value={form.email}
        onChange={updateForm("email")}
        type="email"
        id="email"
        className={`input input-bordered ${
          errors.email ? "border-red-500" : ""
        }`} // Add red border if there's an error
      />
      {errors.email && <span className="text-red-500">{errors.email}</span>}
      {/* Display error message */}
  
      {/* First Name */}
      <label htmlFor="firstName" className="text-lg">
        First Name:{" "}
      </label>
      <input
        placeholder="First Name"
        value={form.firstName}
        onChange={updateForm("firstName")}
        type="text"
        id="firstName"
        className={`input input-bordered ${
          errors.firstName ? "border-red-500" : ""
        }`} // Add red border if there's an error
      />
      {errors.firstName && <span className="text-red-500">{errors.firstName}</span>}
      {/* Display error message */}
  
      {/* Last Name */}
      <label htmlFor="lastName" className="text-lg">
        Last Name:{" "}
      </label>
      <input
        placeholder="Last Name"
        value={form.lastName}
        onChange={updateForm("lastName")}
        type="text"
        id="lastName"
        className={`input input-bordered ${
          errors.lastName ? "border-red-500" : ""
        }`} // Add red border if there's an error
      />
      {errors.lastName && <span className="text-red-500">{errors.lastName}</span>}
      {/* Display error message */}
  
      {/* Phone Number */}
      <label htmlFor="phoneNumber" className="text-lg">
        Phone Number:{" "}
      </label>
      <input
        placeholder="Phone Number"
        value={form.phoneNumber}
        onChange={updateForm("phoneNumber")}
        type="text"
        id="phoneNumber"
        className={`input input-bordered ${
          errors.phoneNumber ? "border-red-500" : ""
        }`} // Add red border if there's an error
      />
      {errors.phoneNumber && <span className="text-red-500">{errors.phoneNumber}</span>}
      
      {/* Password */}
      <label htmlFor="password" className="text-lg">
        Password:{" "}
      </label>
      <input
        placeholder="Password"
        value={form.password}
        onChange={updateForm("password")}
        type="password"
        id="password"
        className={`input input-bordered ${
          errors.password ? "border-red-500" : ""
        }`} // Add red border if there's an error
      />
      {errors.password && <span className="text-red-500">{errors.password}</span>}
      
      {/* Confirm Password */}
      <label htmlFor="confirmPassword" className="text-lg">
        Confirm Password:{" "}
      </label>
      <input
        placeholder="Confirm Password"
        value={form.confirmPassword}
        onChange={updateForm("confirmPassword")}
        type="password"
        id="confirmPassword"
        className={`input input-bordered ${
          errors.confirmPassword ? "border-red-500" : ""
        }`} // Add red border if there's an error
      />
      {errors.confirmPassword && (
        <span className="text-red-500">{errors.confirmPassword}</span>
      )}
    </div>
    <Button onClick={register} className="btn btn-primary mt-4">
      Register
    </Button>
  </div>
  
  );
}