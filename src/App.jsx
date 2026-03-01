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

const pizza = new QueryClient();

const useFetchData = (userId) => {
  const [userData, setUserData] = useState(null);
  const [likesState, setLikesState] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // console.log("before get fetch in App.js");
        let data = {};
        data['userId'] = userId;
        const [res1, res2] = await Promise.all([
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
          })
        ]);
        if (!res1.ok) {
          throw new Error(`HTTP error! Status: ${res1.status}`);
        }
        if (!res2.ok) {
          throw new Error(`HTTP error! Status: ${res2.status}`);
        }
        const data1 = await res1.json();
        const data2 = await res2.json();

        setUserData(data1[0]);
        setLikesState(data2);
        setError(null);

      } catch (error) {

        setError(error);  
        setUserData([]);
      
      } finally {
        
        setLoading(false);

      }

    };

    fetchData();

  }, []);

  return { loading, error, userData, setUserData, likesState, setLikesState};
};

function App() {
  const [ userId, setUserId ] = useState(() => {
    const savedUserId = localStorage.getItem('userId');
    return savedUserId ? JSON.parse(savedUserId) : 0;
  })
  const { loading, error, userData, setUserData, likesState, setLikesState } = useFetchData(userId);

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
          <SarfrozContext.Provider value={{ userData, setUserData, userId, setUserId, likesState, updateLikeState }}>
            <Outlet />
          </SarfrozContext.Provider>
        </QueryClientProvider>
      </div>

    </div>
  )
}

export default App
