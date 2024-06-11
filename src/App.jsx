import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./config/firebase-config.js";
import Home from "./views/Home.jsx";
import Dashboard from "./views/Dashboard.jsx";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import NotFound from "./views/NotFound.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import { AppContext } from "./context/AppContext.jsx";
import { getUserData } from "./services/users.service.js";
import Profile from "./components/Profile/Profile.jsx";
import withLoading from "./hoc/PageLoading.jsx";
import CreateEventForm from "./components/Events/CreateEventForm.jsx";
import AllEvents from "./components/Events/AllEvents.jsx";
import ContactsDashboard from "./components/Contacts/ContactsDashboard.jsx";
import MyEvents from "./components/Events/MyEvents.jsx";
import PublicEvents from "./components/Events/PublicEvents.jsx";
import PrivateEvents from "./components/Events/PrivateEvents.jsx";
import SingleViewEvent from "./components/Events/SingleEventView.jsx";
import UpdateEvent from "./components/Events/UpdateEvent.jsx";
import Calendar from "./components/Calendar/Calendar.jsx";
import { ToastContainer } from "react-toastify";
import AboutUs from "./views/AboutUs.jsx";
import UserSearch from './components/AdminPanel/UserSearch.jsx';
import Blocked from './views/Blocked.jsx';

const HomeWithLoading = withLoading(Home);
const LoginWithLoading = withLoading(Login);
const RegisterWithLoading = withLoading(Register);
const ContactsDashboardWithLoading = withLoading(ContactsDashboard);
const ProfileWithLoading = withLoading(Profile);
const NotFoundWithLoading = withLoading(NotFound);
const DashboardWithLoading = withLoading(Dashboard);
const AboutUsWithLoading = withLoading(AboutUs);
const CalendarWithLoading = withLoading(Calendar);
const CreateEventWithLoading = withLoading(CreateEventForm);
const AllEventsWithLoading = withLoading(AllEvents);
const MyEventsWithLoading = withLoading(MyEvents);
const PublicEventsWithLoading = withLoading(PublicEvents);
const PrivateEventsWithLoading = withLoading(PrivateEvents);
const SingleViewEventWithLoading = withLoading(SingleViewEvent);

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
      <ToastContainer newestOnTop />
      <AppContext.Provider value={{ ...appState, setAppState }}>
        <div className="flex flex-col justify-between max-w-full">
          {appState.userData && appState.userData.isBlocked ? (
            <RestrictedHeader userData={appState.userData} />
          ) : (
            <Header />
          )}
          <div className="container mx-auto min-h-screen min-w-min">
            <Routes>
              <Route
                path="/"
                element={user ? <DashboardWithLoading /> : <HomeWithLoading />}
              />
              <Route path="/login" element={<LoginWithLoading />} />
              <Route path="/register" element={<RegisterWithLoading />} />
              <Route
                path="/contacts"
                element={<ContactsDashboardWithLoading />}
              />
              <Route path="/dashboard" element={<DashboardWithLoading />} />
              <Route
                path="/create-event"
                element={<CreateEventWithLoading />}
              />
              <Route path="/calendar" element={<CalendarWithLoading />} />
              <Route path="/update-event/:eventId" element={<UpdateEvent />} />
              <Route path="/events" element={<AllEventsWithLoading />} />
              <Route path="/my-events" element={<MyEventsWithLoading />} />
              <Route
                path="/public-events"
                element={<PublicEventsWithLoading />}
              />
              <Route
                path="/private-events"
                element={<PrivateEventsWithLoading />}
              />
              <Route
                path="/events/:eventId"
                element={<SingleViewEventWithLoading />}
              />
              <Route path="/profile/:handle" element={<ProfileWithLoading />} />
              <Route path="/about" element={<AboutUsWithLoading />} />
              <Route path="/user-search" element={<UserSearch />} />
              <Route path="/blocked" element={<Blocked />} />
              <Route path="*" element={<NotFoundWithLoading />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </AppContext.Provider>
    </BrowserRouter>
  );
}

export default App;
