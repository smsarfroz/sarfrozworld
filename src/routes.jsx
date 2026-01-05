import App from "./App";
import Home from "./Components/Home/Home.jsx";
import Post from "./Components/Post/Post.jsx";
import Profile from "./Components/Profile/Profile.jsx";
import Search from "./Components/Search/Search.jsx";
import ErrorPage from "../ErrorPage.jsx";

const routes = [
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/home",
                element: <Home />,
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
            }
        ],
        errorElement: <ErrorPage />
    }
]

export default routes;