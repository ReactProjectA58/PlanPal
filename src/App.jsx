import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { app, auth } from "./config/firebase-config.js";
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
import UserSearch from "./components/AdminPanel/UserSearch.jsx";
import Blocked from "./views/Blocked.jsx";
import Authenticated from "./hoc/Authenticated"; // Import the Authenticated component
import { BASE } from "./common/constants.js";

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
      setAppState((prevState) => ({
        ...prevState,
        user,
      }));
    }
  }, [user, appState.user]);

  useEffect(() => {
    if (!appState.user) {
      setAppState((prevState) => ({
        ...prevState,
        userData: null,
      }));
      return;
    }

    getUserData(appState.user.uid).then((snapshot) => {
      const fetchedUserData = snapshot.val()
        ? Object.values(snapshot.val())[0]
        : null;
      const userData = fetchedUserData
        ? { ...fetchedUserData, isBlocked: fetchedUserData.isBlocked ?? false }
        : null;
      setAppState((prevState) => ({
        ...prevState,
        userData,
      }));
    });
  }, [appState.user]);

  const renderDashboard = () => {
    return <DashboardWithLoading />;
  };

  return (
    <BrowserRouter>
      <ToastContainer newestOnTop />
      <AppContext.Provider value={{ ...appState, setAppState }}>
        <div className="flex flex-col justify-between max-w-full">
          <Header />
          <div className="container mx-auto min-h-screen min-w-min">
            <Routes>
              <Route
                path={`${BASE}`}
                element={
                  appState.user ? (
                    appState.userData && appState.userData.isBlocked ? (
                      <Blocked />
                    ) : (
                      renderDashboard()
                    )
                  ) : (
                    <HomeWithLoading />
                  )
                }
              />
              <Route path={`${BASE}login`} element={<LoginWithLoading />} />
              <Route
                path={`${BASE}register`}
                element={<RegisterWithLoading />}
              />
              <Route
                path={`${BASE}contacts`}
                element={
                  <Authenticated>
                    <ContactsDashboardWithLoading />
                  </Authenticated>
                }
              />
              <Route
                path={`${BASE}dashboard`}
                element={
                  <Authenticated>
                    <DashboardWithLoading />
                  </Authenticated>
                }
              />
              <Route
                path={`${BASE}create-event`}
                element={
                  <Authenticated>
                    <CreateEventWithLoading />
                  </Authenticated>
                }
              />
              <Route
                path={`${BASE}calendar`}
                element={
                  <Authenticated>
                    <CalendarWithLoading />
                  </Authenticated>
                }
              />
              <Route
                path={`${BASE}update-event/:eventId`}
                element={
                  <Authenticated>
                    <UpdateEvent />
                  </Authenticated>
                }
              />
              <Route
                path={`${BASE}events`}
                element={
                  <Authenticated>
                    <AllEventsWithLoading />
                  </Authenticated>
                }
              />
              <Route
                path={`${BASE}my-events`}
                element={
                  <Authenticated>
                    <MyEventsWithLoading />
                  </Authenticated>
                }
              />
              <Route
                path={`${BASE}public-events`}
                element={
                  <Authenticated>
                    <PublicEventsWithLoading />
                  </Authenticated>
                }
              />
              <Route
                path={`${BASE}private-events`}
                element={
                  <Authenticated>
                    <PrivateEventsWithLoading />
                  </Authenticated>
                }
              />
              <Route
                path={`${BASE}events/:eventId`}
                element={
                  <Authenticated>
                    <SingleViewEventWithLoading />
                  </Authenticated>
                }
              />
              <Route
                path={`${BASE}profile/:handle`}
                element={
                  <Authenticated>
                    <ProfileWithLoading />
                  </Authenticated>
                }
              />
              <Route path={`${BASE}about`} element={<AboutUsWithLoading />} />
              <Route path={`${BASE}user-search`} element={<UserSearch />} />
              <Route path={`${BASE}blocked`} element={<Blocked />} />
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
