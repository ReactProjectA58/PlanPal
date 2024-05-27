import { createContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, get } from "firebase/database";
import { db } from "../config/firebase-config";
import PropTypes from "prop-types";

export const AppContext = createContext({
  user: null,
  userData: null,
  setAppState: () => {},
});

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = ref(db, `users/${user.email.split("@")[0]}`);
        const snapshot = await get(userRef);
        const userData = snapshot.val();

        setUser(user);
        setUserData({
          id: user.uid,
          username: user.email.split("@")[0],
          ...userData,
        });
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const setAppState = (newUserData) => {
    setUserData(newUserData);
  };

  return (
    <AppContext.Provider value={{ user, userData, setAppState, loading }}>
      {children}
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
