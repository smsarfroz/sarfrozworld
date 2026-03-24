import App from "./App";
import Home from "./Components/Home/Home.jsx";
import Post from "./Components/Post/Post.jsx";
import Profile from "./Components/Profile/Profile.jsx";
import Search from "./Components/Search/Search.jsx";
import ErrorPage from "../ErrorPage.jsx";
import Login from "./Components/Login/Login.jsx";
import Signup from "./Components/Signup/Signup.jsx";
import PostCard from "./Components/PostCard/PostCard.jsx";

const routes = [
    {
        path: "/",
        element: <App />,   
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: '/signup',
                element: <Signup />
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/post",
                element: <Post />,
            },
            {
                path: "/profile",
                element: <Profile />,
            },
            {
                path: "/search",
                element: <Search />,
            }, 
            {
                path: '/posts/:postId', 
                element: <PostCard />
            },
        ],
        errorElement: <ErrorPage />
    }
]

export default routes;