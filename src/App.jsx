import { useState } from 'react'
import { Outlet } from 'react-router';
import { sarfrozContext } from './sarfrozContext';
import { FiHome } from "react-icons/fi";
import { LuSearch } from "react-icons/lu";
import { IoColorFill, IoPersonSharp } from "react-icons/io5";
import { LuPenLine } from "react-icons/lu";
import { MdLogout } from "react-icons/md";

import './App.css'

function App() {

  return (
    <>
      <div className="navigationRoutes">
        <p className='siteName'>sarfrozworld</p>

        <div className="iconList">
          <p><FiHome size={22} style={{ color: "DodgerBlue" }}/>Home</p>
          <p><LuSearch size={22}/>Search</p>
          <p><LuPenLine size={22}/>Post</p>
          <p><IoPersonSharp size={22}/>Profile</p>
          <p><MdLogout size={22}/>Logout</p>
        </div>
      </div>


      <div className="commonBackground">
        <sarfrozContext.Provider>
          <Outlet />
        </sarfrozContext.Provider>
      </div>
    </>
  )
}

export default App
