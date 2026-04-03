import { Link } from "react-router-dom";
import "../Assets/CSS/errors.css";
import errorImage from "../Assets/Images/error-400.svg";

const Error400 = () => {
  return (
    <div className="error-container error-400">
      <div className="error-wrapper">
        <div className="error-content">
          <div className="error-code">
            <span className="code-digit code-4">4</span>
            <span className="code-digit code-0-1">0</span>
            <span className="code-digit code-0-2">0</span>
          </div>

          <h1 className="error-title">Bad Request</h1>
          <p className="error-description">
            Oops! The request was malformed or invalid. Please check your input
            and try again.
          </p>

          <div className="error-illustration">
            <img src={errorImage} alt="Bad Request" className="error-image" />
            <div className="floating-particles">
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
            </div>
          </div>

          <div className="error-actions">
            <Link to="/" className="btn btn-primary">
              Back to Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="btn btn-secondary"
            >
              Go Back
            </button>
          </div>

          <div className="error-footer">
            <p>
              Error Code: <code>400</code>
            </p>
            <p>If this problem persists, please contact support.</p>
          </div>
        </div>

        <div className="error-decoration"></div>
      </div>
    </div>
  );
};

export default Error400;
