import { Link } from 'react-router-dom';
import './style/NotFound.css';

export default function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Page Not Found</h2>
        <p className="not-found-message">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-home-link">
          Return to Home
        </Link>
      </div>
    </div>
  );
}