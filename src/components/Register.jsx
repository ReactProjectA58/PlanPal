import { useContext, useState, useEffect } from "react";
import { registerUser } from "../services/auth.service";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { createUserHandle } from "../services/users.service";
import Button from "./Button";
import { validateRegister } from "../common/helpers/validationHelpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"; // Import icons directly

export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    avatar: "",
    password: "",
    confirmPassword: "",
    address: "",
    userName: "",
  });
  const [errors, setErrors] = useState({});
  const { user, setAppState } = useContext(AppContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const register = async () => {
    const validationErrors = await validateRegister(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      const credential = await registerUser(form.email, form.password);
      const userData = {
        uid: credential.user.uid,
        email: credential.user.email,
        firstName: form.firstName,
        lastName: form.lastName,
        phoneNumber: form.phoneNumber,
        address: "",
        avatar: "https://firebasestorage.googleapis.com/v0/b/planpal-65592.appspot.com/o/avatars%2Fdefault-profile.png?alt=media&token=fd3e31cf-95d7-4bbd-a9e4-7155048663dd",
        handle: form.userName,
        isBlocked: false,
        role: "User",
      };
      await createUserHandle(userData);
      setAppState({ user: credential.user, userData });
      navigate("/");
    }
  };

  return (
    <div className="container mx-auto mb-32">
      <h1 className="text-3xl font-semibold mb-4">Register</h1>
      <div className="flex flex-col space-y-2">
        <label htmlFor="userName" className="text-lg">
          Username{" "}
        </label>
        <input
          placeholder="Enter Your Username"
          value={form.userName}
          onChange={updateForm("userName")}
          type="text"
          id="userName"
          className={`input input-bordered ${
            errors.userName ? "border-red-500" : ""
          }`}
        />
        {errors.userName && (
          <span className="text-red-500">{errors.userName}</span>
        )}

        <label htmlFor="email" className="text-lg">
          Email{" "}
        </label>
        <input
          placeholder="Enter Your Email"
          value={form.email}
          onChange={updateForm("email")}
          type="email"
          id="email"
          className={`input input-bordered ${
            errors.email ? "border-red-500" : ""
          }`}
        />
        {errors.email && <span className="text-red-500">{errors.email}</span>}

        <label htmlFor="firstName" className="text-lg">
          First Name{" "}
        </label>
        <input
          placeholder="Enter Your First Name"
          value={form.firstName}
          onChange={updateForm("firstName")}
          type="text"
          id="firstName"
          className={`input input-bordered ${
            errors.firstName ? "border-red-500" : ""
          }`}
        />
        {errors.firstName && (
          <span className="text-red-500">{errors.firstName}</span>
        )}

        <label htmlFor="lastName" className="text-lg">
          Last Name{" "}
        </label>
        <input
          placeholder="Enter Your Last Name"
          value={form.lastName}
          onChange={updateForm("lastName")}
          type="text"
          id="lastName"
          className={`input input-bordered ${
            errors.lastName ? "border-red-500" : ""
          }`}
        />
        {errors.lastName && (
          <span className="text-red-500">{errors.lastName}</span>
        )}

        <label htmlFor="phoneNumber" className="text-lg">
          Phone Number{" "}
        </label>
        <input
          placeholder="Enter Your Phone Number"
          value={form.phoneNumber}
          onChange={updateForm("phoneNumber")}
          type="text"
          id="phoneNumber"
          className={`input input-bordered ${
            errors.phoneNumber ? "border-red-500" : ""
          }`}
        />
        {errors.phoneNumber && (
          <span className="text-red-500">{errors.phoneNumber}</span>
        )}

        <label htmlFor="password" className="text-lg">
          Password{" "}
        </label>
        <div className="relative">
          <input
            placeholder="Enter Your Password"
            value={form.password}
            onChange={updateForm("password")}
            type={showPassword ? "text" : "password"}
            id="password"
            className={`input input-bordered w-full ${
              errors.password ? "border-red-500" : ""
            }`}
          />
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute right-2 top-2"
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>
        {errors.password && (
          <span className="text-red-500">{errors.password}</span>
        )}

        <label htmlFor="confirmPassword" className="text-lg">
          Confirm Password{" "}
        </label>
        <div className="relative">
          <input
            placeholder="Confirm Your Password"
            value={form.confirmPassword}
            onChange={updateForm("confirmPassword")}
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            className={`input input-bordered w-full ${
              errors.confirmPassword ? "border-red-500" : ""
            }`}
          />
          <button
            type="button"
            onClick={toggleShowConfirmPassword}
            className="absolute right-2 top-2"
          >
            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
          </button>
        </div>
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
