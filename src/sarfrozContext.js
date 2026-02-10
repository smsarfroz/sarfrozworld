import React, { createContext } from "react";

export const SarfrozContext = createContext({
    userData: null, 
    setUserData: () => {},
    userId: null,
    setUserId: () => {},
    loggedIn: false,
    username: null
});