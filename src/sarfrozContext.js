import React, { createContext } from "react";

export const SarfrozContext = createContext({
    userData: null, 
    setUserData: () => {}
});