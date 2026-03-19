import { Link } from "react-router-dom";

const ErrorPage = () => {
    return (
        <div>
            <div className="error-content">
                <h1>404</h1>
                <div className="vertical-line"></div>
                <p>This page could not be found.</p>
            </div>
            <Link to="/home" className="move-to-home">Move to Home Page</Link>
        </div>
    )
}

export default ErrorPage;