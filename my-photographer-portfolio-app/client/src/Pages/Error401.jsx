import { Link } from "react-router-dom";
import "../Assets/CSS/errors.css";
import errorImage from "../Assets/Images/error-401.svg";
const Error401 = () => {
  return (
    <div className="error-container error-401">
      <div className="error-wrapper">
        <div className="error-content">
          <div className="error-code">
            <span className="code-digit code-4">4</span>
            <span className="code-digit code-0-1">0</span>
            <span className="code-digit code-1">1</span>
          </div>

          <h1 className="error-title">Unauthorized</h1>
          <p className="error-description">
            You need to be logged with correct role to access this resource.
          </p>

          <div className="error-illustration">
            <img
              src={errorImage}
              alt="Unauthorized Access"
              className="error-image"
            />
            <div className="floating-particles">
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
            </div>
          </div>

          <div className="error-actions">
            <Link to="/" className="btn btn-secondary">
              Back to Home
            </Link>
          </div>

          <div className="error-footer">
            <p>
              Error Code: <code>401</code>
            </p>
            <p>Authentication required to continue.</p>
          </div>
        </div>

        <div className="error-decoration"></div>
      </div>
    </div>
  );
};

export default Error401;
