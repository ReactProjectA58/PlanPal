import { useContext, useState, useEffect } from "react";
import { registerUser } from "../services/auth.service";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { createUserHandle, getUserByHandle } from "../services/users.service";

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
  };

  return (
    <div className="flex items-center min-h-screen bg-gray-50">
      <div className="container mx-auto">
        <h1 className="text-center text-3xl font-semibold text-gray-900">
          Register
        </h1>

        <div className="mt-8 space-y-6">
          <div>
            <input
              placeholder="Username"
              value={form.userName}
              onChange={updateForm("userName")}
              type="text"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <input
              placeholder="Email"
              value={form.email}
              onChange={updateForm("email")}
              type="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <input
              placeholder="First Name"
              value={form.firstName}
              onChange={updateForm("firstName")}
              type="text"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <input
              placeholder="Last Name"
              value={form.lastName}
              onChange={updateForm("lastName")}
              type="text"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <input
              placeholder="Phone"
              value={form.phone}
              onChange={updateForm("phone")}
              type="text"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <input
              placeholder="Password"
              value={form.password}
              onChange={updateForm("password")}
              type="password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <input
              placeholder="Confirm Password"
              value={form.repeatPassword}
              onChange={updateForm("repeatPassword")}
              type="password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          <div className="flex justify-center">
            <button
              className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"
              onClick={register}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
