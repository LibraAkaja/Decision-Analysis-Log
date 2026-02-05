import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import '../style/Home.css';
import logo from '../assets/decision_analyzer_transparent.png';

const Home = () => {
    const { user } = useAuth();

    return (
        <main className="home-container">
            <section className="hero">
                <img src={logo} alt="Decision Analyzer Logo" className="hero-logo" />
                <h1>Decision Analyzer</h1>
                <p className="tagline">Make better decisions with structured analysis</p>
                <p className="description">
                    Organize your thoughts, evaluate options with ratings, and make informed decisions.
                </p>

                {user ? (
                    <div className="user-actions">
                        <Link to="/dashboard" className="btn-primary-link">
                            Go to Dashboard
                        </Link>
                        {user.role === 'admin' && (
                            <Link to="/admin" className="btn-secondary-link">
                                Admin Panel
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="auth-actions">
                        <Link to="/login" className="btn-primary-link">
                            Login
                        </Link>
                        <Link to="/register" className="btn-secondary-link">
                            Register
                        </Link>
                    </div>
                )}
            </section>

            <section className="features">
                <h2>Features</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <h3>📄 Create Decisions</h3>
                        <p>Define decisions with titles and descriptions</p>
                    </div>
                    <div className="feature-card">
                        <h3>⭐ Rate Options</h3>
                        <p>Evaluate each option with a 1-5 rating system</p>
                    </div>
                    <div className="feature-card">
                        <h3>🔒 Secure & Private</h3>
                        <p>Your decisions are private and securely stored</p>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Home;