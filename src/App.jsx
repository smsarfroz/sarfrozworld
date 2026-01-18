import { useEffect, useState } from 'react'
import { Outlet } from 'react-router';
// import { sarfrozContext } from './sarfrozContext';
import { FiHome } from "react-icons/fi";
import { LuSearch } from "react-icons/lu";
import { IoColorFill, IoPersonSharp } from "react-icons/io5";
import { LuPenLine } from "react-icons/lu";
import { MdLogout } from "react-icons/md";
import { Link } from 'react-router-dom';
import Loading from './Components/Loading/Loading.jsx';
import './App.css'
import ErrorPage from '../ErrorPage.jsx';
import { SarfrozContext } from './sarfrozContext.js';

const VITE_BASE_URL =  import.meta.env.VITE_BASE_URL || '/api';

const useFetchData = () => {
  const api1 = `${VITE_BASE_URL}/users/profile`;
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [res1] = await Promise.all([
          fetch(api1, {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
            }
          })
        ]);
        console.log("res1", res1);
        if (!res1.ok) {
          throw new Error(`HTTP error! Status: ${Response.status}`);
        }
        console.log("res1", res1);
        console.log("res1 headers:", res1.headers.get('Set-Cookie'));
        const data1 = await res1.json();

        setUserData(data1[0]);
        setError(null);

      } catch (error) {

        setError(error);  
        setUserData([]);
      
      } finally {
        
        setLoading(false);

      }

    };

    fetchData();

  }, [api1]);


  return { loading, error, userData, setUserData};
};

function App() {
  const { loading, error, userData, setUserData } = useFetchData();

  console.log("userData in App.js", userData);
  // function updateData (data) {
  //   setUserData(prevData => ({
  //     ...prevData,
  //     ...data
  //   }))
  // };

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <ErrorPage />;
  }

  return (
    <div className='sectionsContainer'>
      <div className="navigationRoutes">
        <p className='siteName'>sarfrozworld</p>
        <div className="iconList">
          
          <p><FiHome size={22}/><Link to='/home'>home</Link></p>
          <p><LuSearch size={22}/><Link to='/search'>Search</Link></p>
          <p><LuPenLine size={22}/><Link to='/post'>Post</Link></p>
          <p><IoPersonSharp size={22}/><Link to='/profile'>Profile</Link></p>
          <p><MdLogout size={22}/><Link to='/logout'>Logout</Link></p>
        </div>
      </div>


      <div className="commonBackground">
        <SarfrozContext.Provider value={{ userData, setUserData }}>
          <Outlet />
        </SarfrozContext.Provider>
      </div>

    </div>
  )
}

export default App
