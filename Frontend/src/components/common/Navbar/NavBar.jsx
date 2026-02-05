import { useAuth } from '../../../context/AuthContext';
import { Link } from 'react-router-dom';
import logo from '../../../assets/decision_analyzer_transparent.png';
import '../../../style/Navbar.css';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const { user } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (menuOpen) setMenuOpen(false);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [menuOpen]);

    return (
        <nav className={`navbar ${menuOpen ? 'menu-open' : ''}`}>
            <NavLogoSection />
            <button
                className="hamburger"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
            >
                ☰
            </button>
            <div className="desktop-menu">
                <NavMenu />
            </div>
            {menuOpen && (
                <div className="handheld-menu open">
                    <NavMenu />
                </div>
            )}
        </nav>
    );
};

const NavMenu = () => {
    return (
        <section className="nav-menu">
            <Link to="/dashboard" className="nav-link">
                Dashboard
            </Link>
            <Link to="/admin" className="nav-link">
                Admin
            </Link>
            <Link to="/" className="nav-link">
                Home
            </Link>
        </section>
    );
};

const NavLogoSection = () => {
    return (
        <section className="nav-logo-section">
            <Link to="/" className="nav-logo-link">
                <img src={logo} alt="Decision Analyzer Logo" className="nav-logo" />
                <h1>Decision Analyzer</h1>
            </Link>
        </section>
    );
};

export default Navbar;