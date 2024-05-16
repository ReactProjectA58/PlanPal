import { createContext } from "react";

const AppContext = createContext({
  user: null,
  userData: null,
  setAppState() {},
});

export default AppContext;
