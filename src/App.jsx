import { useEffect, useState } from 'react'
import { Outlet } from 'react-router';
import { sarfrozContext } from './sarfrozContext';
import { FiHome } from "react-icons/fi";
import { LuSearch } from "react-icons/lu";
import { IoColorFill, IoPersonSharp } from "react-icons/io5";
import { LuPenLine } from "react-icons/lu";
import { MdLogout } from "react-icons/md";
import { Link } from 'react-router-dom';
import Loading from './Components/Loading/Loading.jsx';
import './App.css'

const VITE_BASE_URL =  import.meta.env.VITE_BASE_URL || '/api';

const useFetchData = () => {
  const api1 = `${VITE_BASE_URL}/users/:username`;
  console.log('api1', api1);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log('outside try');
      try {
        const [res1] = await Promise.all([
          fetch(api1)
        ]);
        console.log('res1 ', res1);
        if (!res1.ok) {
          throw new Error(`HTTP error! Status: ${Response.status}`);
        }

        const data1 = await res1.json();

        setUserData(data1);

        setLoading(false);

      } catch (error) {

        setError(error);

      };

    };

    fetchData();

  }, [api1]);

  return { loading, error, userData};
}

function App() {
  const { loading, error, userData } = useFetchData();
  console.log('userData ', userData);

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <ErrorPage />;
  }

  return (
    <>
      <div className="navigationRoutes">
        <p className='siteName'>sarfrozworld</p>
        <div className="iconList">
          
          <p><FiHome size={22} style={{ color: "DodgerBlue" }}/><Link to='/home'>home</Link></p>
          <p><LuSearch size={22}/><Link to='/search'>Search</Link></p>
          <p><LuPenLine size={22}/><Link to='/post'>Post</Link></p>
          <p><IoPersonSharp size={22}/><Link to='/profile'>Profile</Link></p>
          <p><MdLogout size={22}/><Link to='/logout'>Logout</Link></p>
        </div>
      </div>


      <div className="commonBackground">
        <sarfrozContext.Provider value={{ userData }}>
          <Outlet />
        </sarfrozContext.Provider>
      </div>
    </>
  )
}

export default App
