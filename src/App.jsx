import { useState } from 'react'
import { Outlet } from 'react-router';
import './App.css'

function App() {

  return (
    <>
      <h1>Hello!</h1>

      {/* <div className="commonBackground"> */}
        <Outlet />
      {/* </div> */}
    </>
  )
}

export default App
