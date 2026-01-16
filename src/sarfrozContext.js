import React, { createContext, useState } from "react";

export const sarfrozContext = createContext({
    userData: null, 
    setUserData: () => {}
});