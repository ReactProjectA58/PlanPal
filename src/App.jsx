import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./config/firebase-config.js";
import Home from "./views/Home.jsx";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import NotFound from "./views/NotFound.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import { AppContext } from "./context/AppContext.jsx";
import { getUserData } from "./services/users.service.js";
import ContactsList from "./components/Contacts/ContactsList.jsx";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import Profile from "./components/Profile/Profile.jsx";

function App() {
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
  });
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (appState.user !== user) {
      setAppState((prevState) => ({ ...prevState, user }));
    }
  }, [user, appState.user]);

  useEffect(() => {
    if (!appState.user) return;

    getUserData(appState.user.uid).then((snapshot) => {
      const userData = snapshot.val() ? Object.values(snapshot.val())[0] : null;
      setAppState((prevState) => ({ ...prevState, userData }));
    });
  }, [appState.user]);

  return (
    <BrowserRouter>
      <AppContext.Provider value={{ ...appState, setAppState }}>
        <Header />
        <Sidebar />
        <div className="container mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/contacts" element={<ContactsList />} />
            <Route path="/profile/:handle" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </AppContext.Provider>
    </BrowserRouter>
  );
}

export default App;
