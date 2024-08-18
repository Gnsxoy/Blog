import { createContext, useContext } from "react";
import App from "./app";

const ctx = createContext({
  sApp: new App(),
});

export const useStores = () => {
  return useContext(ctx);
};
