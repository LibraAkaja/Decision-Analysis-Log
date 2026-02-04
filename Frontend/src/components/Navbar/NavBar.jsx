import publicMenu from './publicMenu';
import customerMenu from './customerMenu';
import providerMenu from './providerMenu';
import { useAuth } from '../../../hooks/useAuth.jsx';
import { Link } from 'react-router-dom';
import CitysewaLogo from './../../../assets/cs.png';
import "./../../../Style/Navbar.css";
import { useState, useEffect } from 'react';
import hamburger from './../../../assets/ham.png';

const Navbar = (props) => {
    const {user} = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const isAuthenticated = !!user;

    let menu = publicMenu; //Default menu to be displayed

    // if(isAuthenticated) 
    {
        // if(user.role === 'admin') menu = adminMenu;
        // if(user.role === 'provider') menu = providerMenu;
        // if(user.role === 'customer') menu = customerMenu;
        if(props.type === 'admin') menu = adminMenu;
        if(props.type === 'provider') menu = providerMenu;
        if(props.type === 'customer') menu = customerMenu;
    }

    useEffect(()=>{
        const handleScroll = () => {
            if(menuOpen) setMenuOpen(false);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    },[menuOpen]);

    return(
        <nav className={`navbar ${menuOpen ? 'menu-open' : ''}`}>
            <NavLogoSection/>
            {/* Hamburger for smaller devices */}
            <img src={hamburger} className='hamburger' width={30} onClick={()=>setMenuOpen(prev => !prev)} alt='menu'/>
            {/* Nav menu for desktop devices */}
            <div className='desktop-menu'>
                <NavMenu menu={menu} role={props.type}/>
            </div>
            {/* Nav menu for handheld devices */}
            {  menuOpen && (
                <div className={`handheld-menu ${menuOpen ? 'open' : ''}`}>
                    <NavMenu menu={menu} role={props.type}/>
                </div>
            )}
        </nav>
    );
};

const NavMenu = (props) => {
    return(
        <section className='nav-menu'>
            {props.menu.map((navItem) => (
                <div className='navItem'key={navItem.key}>
                    <Link to={navItem.path} style={{all: 'unset'}}>
                        <span>{navItem.label}</span>
                    </Link>
                </div>
            ))}
        </section>
    );
}

const NavLogoSection = () => {
    return(
        <section className='nav-logo-section'>
            <div className='siteLogo'></div>
            <h1>CitySewa</h1>
        </section>
    );
}

export default Navbar;