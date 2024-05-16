import { useEffect, useState } from "react";
import "./App.css";
import { getUserData } from "./services/users.service.js";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./config/firebase-config.js";

export default function App() {
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
  });
  const [user] = useAuthState(auth);

  if (appState.user !== user) {
    setAppState({ ...appState, user });
  }

  useEffect(() => {
    if (!appState.user) return;

    getUserData(appState.user.uid).then((snapshot) => {
      const userData = Object.values(snapshot.val())[0];
      setAppState({ ...appState, userData });
    });
  }, [appState.user]);

  return (
    <>
      <div className="diff aspect-[16/9]">
        <div className="diff-item-1">
          <div className="bg-primary text-primary-content text-9xl font-black grid place-content-center">
            HELLO WORLD
          </div>
        </div>
        <div className="diff-item-2">
          <div className="bg-base-200 text-9xl font-black grid place-content-center">
            HELLO WORLD
          </div>
        </div>
        <div className="diff-resizer"></div>
      </div>
    </>
  );
}
