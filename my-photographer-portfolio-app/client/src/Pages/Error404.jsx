import { Link } from "react-router-dom";
import "../Assets/CSS/errors.css";
import errorImage from "../Assets/Images/error-404.svg";

const Error404 = () => {
  return (
    <div className="error-container error-404">
      <div className="error-wrapper">
        <div className="error-content">
          <div className="error-code">
            <span className="code-digit code-4">4</span>
            <span className="code-digit code-0-1">0</span>
            <span className="code-digit code-4-last">4</span>
          </div>

          <h1 className="error-title">Page Not Found</h1>
          <p className="error-description">
            The page you're looking for doesn't exist. It might have been moved
            or deleted.
          </p>

          <div className="error-illustration">
            <img
              src={errorImage}
              alt="Page Not Found"
              className="error-image"
            />
            <div className="floating-particles">
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
            </div>
          </div>

          <div className="error-actions">
            <Link to="/" className="btn btn-primary">
              Back to Home
            </Link>
            <Link to="/my-project" className="btn btn-secondary">
              View My Project
            </Link>
            <Link to="/portrait" className="btn btn-secondary">
              View Portrait
            </Link>
            <Link to="/about" className="btn btn-secondary">
              View About Me
            </Link>
          </div>

          <div className="error-footer">
            <p>
              Error Code: <code>404</code>
            </p>
            <p>Page not found - Let's get you back on track.</p>
          </div>
        </div>

        <div className="error-decoration"></div>
      </div>
    </div>
  );
};

export default Error404;
