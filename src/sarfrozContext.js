import React, { createContext, useState } from "react";

export const SarfrozContext = createContext({
    userData: null, 
    setUserData: () => {}
});