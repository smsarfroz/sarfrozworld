import { useContext, useEffect, useState } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router';
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
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/ReactToastify.css';
import Cookies from 'universal-cookie';
import { jwtDecode } from 'jwt-decode';
import getErrorMessage from './utils/getErrorMessage.js';

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
  const navigate = useNavigate();

  useEffect(() => {
    const cookies = new Cookies();

    const token = cookies.get('jwt_authorization');


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
          toast.error(getErrorMessage(res1.status));
          throw new Error(`HTTP error! Status: ${res1.status}`);
        }
        if (!res2.ok) {
          toast.error(getErrorMessage(res1.status));
          throw new Error(`HTTP error! Status: ${res2.status}`);
        }
        if (!res3.ok) {
          toast.error(getErrorMessage(res1.status));
          throw new Error(`HTTP error! Status: ${res3.status}`);
        }

        const data1 = await res1.json();
        const data2 = await res2.json();
        const data3 = await res3.json();

        setUserData(data1 ? data1[0]: null);
        setLikesState(data2);
        setUsersData(data3);
        setError(null);

      } catch (error) {

        setError(error);  
        setUserData([]);
        setUsersData(null);
        toast.error(`There was a problem with the fetch operation`);
      } finally {
        
        setLoading(false);

      }
    };

    if (!token) {
      setLoading(false);
      navigate('/login');
    } else {
      fetchData();
    }

  }, [userId, navigate]);

  // if (!userId) return;
  return { loading, error, userData, setUserData, likesState, setLikesState, usersData, setUsersData };
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [deleted, setDeleted] = useState(false);
  const cookies = new Cookies();
  const [userObj, setUserObj] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const { loading, error, userData, setUserData, likesState, setLikesState, usersData, setUsersData } = useFetchData(userObj ? userObj.userId : 9);

  useEffect(() => {
      const token = cookies.get('jwt_authorization');

      if (!token) {
        navigate('/login');
      }
      const decoded = token ? jwtDecode(token) : null;
      setUserObj(decoded);
      setLoggedIn(true);
  }, []);

  useEffect(() => {
    
  }, [userObj]);
  
  const [activeTab, setActiveTab] = useState(() => {
    const path = location.pathname;
    if (path === '/') return 0;
    if (path === '/search') return 1;
    if (path === '/post') return 2;
    if (path === '/profile') return 3;
    return 0;
  });

  const pathname = useLocation().pathname;
  const hiddenPaths = ['/login', '/signup'];

  // const [ loggedIn, setLoggedIn ] = useState(() => {
  //   const savedLoggedIn = localStorage.getItem('loggedIn');
  //   return savedLoggedIn ? JSON.parse(savedLoggedIn) : false;
  // })

  // const [ userId, setUserId ] = useState(() => {
  //   const savedUserId = localStorage.getItem('userId');
  //   return savedUserId ? JSON.parse(savedUserId) : 0;
  // })

  // const [ username, setUsername ] = useState(() => {
  //   const savedUsername = localStorage.getItem('username');
  //   return savedUsername ? JSON.parse(savedUsername) : 0;
  // });

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
        toast.error(getErrorMessage(res.status));
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      setUserObj(null);
      cookies.remove("jwt_authorization");
      setLoggedIn(false);

      navigate('/login');
    } catch (error) {
      toast.error('There was an error with fetch operation');
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
    return <p className="loadingSign">Loading...</p>;
  }
  if (error) {
    console.log('error: ', error);
    return <ErrorPage />;
  }

  return (
    <div className='sectionsContainer'>
      <ToastContainer position="top-center" autoClose={2000} />    

      {!hiddenPaths.includes(pathname) ? 
      
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
        : null   
      }

      <main className="commonBackground">
        <QueryClientProvider client={pizza}>
          <SarfrozContext.Provider value={{ userData, setUserData, loggedIn, setLoggedIn, likesState, updateLikeState, usersData, setUsersData, deleted, setDeleted, userObj, setUserObj }}>
            <Outlet />
          </SarfrozContext.Provider>
        </QueryClientProvider>
      </main>

      {!hiddenPaths.includes(pathname) ?
        <footer className="iconListM">
          
          <div className='tabM' onClick={() => handleTabClick(0, '/')} style={activeTab === 0 ? styleObject2 : null}><FiHome size={31}/> </div>
          <div className='tabM' onClick={() => handleTabClick(2, '/post')} style={activeTab === 2 ? styleObject2 : null}><LuPenLine size={31}/> </div>
          <div className='tabM' onClick={() => handleTabClick(1, '/search')} style={activeTab === 1 ? styleObject2 : null}><LuSearch size={31}/> </div>
          <div className='tabM' onClick={() => handleTabClick(3, '/profile')} style={activeTab === 3 ? styleObject2 : null}><IoPersonSharp size={31}/> </div>
          <div onClick={() => handleLogout()} className='tabM'><MdLogout size={31}/> </div> 

        </footer>
        : null
      }
    </div>
  )
}

export default App
