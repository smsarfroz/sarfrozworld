import { useContext, useEffect, useState } from 'react'
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
import { QueryClientProvider, QueryClient, Query } from "@tanstack/react-query"

const VITE_BASE_URL =  import.meta.env.VITE_BASE_URL || '/api';
const api1 = `${VITE_BASE_URL}/users/profile`;
const api2 = `${VITE_BASE_URL}/users/likesState`;
const api3 = `${VITE_BASE_URL}/users/`;

const pizza = new QueryClient();

const useFetchData = (userId) => {
  const [userData, setUserData] = useState(null);
  const [likesState, setLikesState] = useState({});
  const [usersData, setUsersData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // console.log("before get fetch in App.js");
        let data = {};
        data['userId'] = userId;
        const [res1, res2, res3] = await Promise.all([
          fetch(api1, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            mode: 'cors',
            body: JSON.stringify(data)
          }),
          fetch(api2, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            mode: 'cors',
            body: JSON.stringify(data)
          }),
          fetch(api3, {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            mode: 'cors',
          }),
        ]);
        if (!res1.ok) {
          throw new Error(`HTTP error! Status: ${res1.status}`);
        }
        if (!res2.ok) {
          throw new Error(`HTTP error! Status: ${res2.status}`);
        }
        if (!res3.ok) {
          throw new Error(`HTTP error! Status: ${res3.status}`);
        }

        const data1 = await res1.json();
        const data2 = await res2.json();
        const data3 = await res3.json();

        setUserData(data1[0]);
        setLikesState(data2);
        setUsersData(data3);
        setError(null);

      } catch (error) {

        setError(error);  
        setUserData([]);
        setUsersData(null);
      
      } finally {
        
        setLoading(false);

      }

    };

    fetchData();

  }, []);

  return { loading, error, userData, setUserData, likesState, setLikesState, usersData, setUsersData };
};

function App() {
  const [ userId, setUserId ] = useState(() => {
    const savedUserId = localStorage.getItem('userId');
    return savedUserId ? JSON.parse(savedUserId) : 0;
  })
  const { loading, error, userData, setUserData, likesState, setLikesState, usersData, setUsersData } = useFetchData(userId);

  // console.log('usersData', usersData);

  // const [likesState, setLikesState] = useState({});

  const updateLikeState = (postId, liked, likesCount) => {
    setLikesState(prev => ({
      ...prev,
      [postId]: { liked, likesCount }
    }));
  };

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
          {/* <a href={api1} target='_blank' rel='noopener noreferrer'>Authenticate with Google</a> */}
        </div>
      </div>


      <div className="commonBackground">
        <QueryClientProvider client={pizza}>
          <SarfrozContext.Provider value={{ userData, setUserData, userId, setUserId, likesState, updateLikeState, usersData, setUsersData }}>
            <Outlet />
          </SarfrozContext.Provider>
        </QueryClientProvider>
      </div>

    </div>
  )
}

export default App
