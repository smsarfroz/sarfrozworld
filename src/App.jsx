import { useContext, useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router';
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
import Signup from './Components/Signup/Signup.jsx';
import Login from './Components/Login/Login.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/ReactToastify.css';

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

  }, [userId]);

  return { loading, error, userData, setUserData, likesState, setLikesState, usersData, setUsersData };
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [deleted, setDeleted] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    const path = location.pathname;
    if (path === '/') return 0;
    if (path === '/search') return 1;
    if (path === '/post') return 2;
    if (path === '/profile') return 3;
    return 0;
  });

  const [ loggedIn, setLoggedIn ] = useState(() => {
    const savedLoggedIn = localStorage.getItem('loggedIn');
    return savedLoggedIn ? JSON.parse(savedLoggedIn) : false;
  })

  const [ userId, setUserId ] = useState(() => {
    const savedUserId = localStorage.getItem('userId');
    return savedUserId ? JSON.parse(savedUserId) : 0;
  })

  const [ username, setUsername ] = useState(() => {
    const savedUsername = localStorage.getItem('username');
    return savedUsername ? JSON.parse(savedUsername) : 0;
  });

  const { loading, error, userData, setUserData, likesState, setLikesState, usersData, setUsersData } = useFetchData(userId);

  const updateLikeState = (postId, liked, likesCount) => {
    setLikesState(prev => ({
      ...prev,
      [postId]: { liked, likesCount }
    }));
  };
  
  const handleLogout = async () => {
    const api = `${VITE_BASE_URL}/logout`;
    try {
      const res = await fetch(api, { method: "POST"} );
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      setLoggedIn(false);
      localStorage.removeItem('token');
      localStorage.removeItem('loggedIn');
      localStorage.removeItem('username');
      localStorage.removeItem('userId');

      navigate('/login');
    } catch (error) {
      console.error(`There was an error with fetch operation: `, error);
      throw error;
    }
  };

  const styleObject = {
    backgroundColor:"rgba(58, 58, 58, 1)",
    opacity: "0.9", 
    transition: "background-color 0.09s ease-in",
    borderRadius: "8px"
  };

  const styleObject2 = {
    color: "rgb(81, 81, 233)",
  }

  const handleTabClick = (tabIndex, path) => {
    setActiveTab(tabIndex);
    navigate(path);
  };

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <ErrorPage />;
  }


  return (
    <div className='sectionsContainer'>
      <ToastContainer position="top-center" autoClose={2000} />    

      <nav className="navigationRoutes">
        <p className='siteName'>sarfrozworld</p>
        <div className="iconList">
          
          <div className='tab' onClick={() => handleTabClick(0, '/')} style={activeTab === 0 ? styleObject : null}><FiHome size={25}/><span>Home</span> </div>
          <div className='tab' onClick={() => handleTabClick(2, '/post')} style={activeTab === 2 ? styleObject : null}><LuPenLine size={25}/><span>Post</span> </div>
          <div className='tab' onClick={() => handleTabClick(1, '/search')} style={activeTab === 1 ? styleObject : null}><LuSearch size={25}/><span>Search</span> </div>
          <div className='tab' onClick={() => handleTabClick(3, '/profile')} style={activeTab === 3 ? styleObject : null}><IoPersonSharp size={25}/><span>Profile</span> </div>
          <div onClick={() => handleLogout()} className='tab'><MdLogout size={25}/> <span>Logout</span> </div> 

        </div>
      </nav>      

      <main className="commonBackground">
        <QueryClientProvider client={pizza}>
          <SarfrozContext.Provider value={{ userData, setUserData, userId, setUserId, loggedIn, setLoggedIn, username, setUsername, likesState, updateLikeState, usersData, setUsersData, deleted, setDeleted }}>
            <Outlet />
          </SarfrozContext.Provider>
        </QueryClientProvider>
      </main>

      <footer className="iconListM">
        
        <div className='tabM' onClick={() => handleTabClick(0, '/')} style={activeTab === 0 ? styleObject2 : null}><FiHome size={50}/> </div>
        <div className='tabM' onClick={() => handleTabClick(2, '/post')} style={activeTab === 2 ? styleObject2 : null}><LuPenLine size={50}/> </div>
        <div className='tabM' onClick={() => handleTabClick(1, '/search')} style={activeTab === 1 ? styleObject2 : null}><LuSearch size={50}/> </div>
        <div className='tabM' onClick={() => handleTabClick(3, '/profile')} style={activeTab === 3 ? styleObject2 : null}><IoPersonSharp size={50}/> </div>
        <div onClick={() => handleLogout()} className='tabM'><MdLogout size={50}/> </div> 

      </footer>
    </div>
  )
}

export default App
