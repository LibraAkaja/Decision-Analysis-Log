import { Link } from "react-router-dom";
import '../../../Style/Footer.css';
import footerPublic from "./footerPublic";
import footerCustomer from "./footerCustomer";
import footerProvider from "./footerProvider";
import footerAdmin from "./footerAdmin";

const Footer = (props) => {
    let footerLinks = footerPublic;
    if(props.type === 'customer') footerLinks = footerCustomer;
    if(props.type === 'provider') footerLinks = footerProvider;
    if(props.type === 'admin') footerLinks = footerAdmin;
    return(
        <footer className="footer">
            <section className="footerTop">
                <h2>CitySewa</h2>
                <p>Connecting Local Skills with Local Needs</p>
            </section>
            <section className="footerLinks">
                {Object.entries(footerLinks).map(([section, links]) => (
                    <div className="footerColumn" key={section}>
                        <h4>{section.charAt(0).toUpperCase() + section.slice(1)}</h4>
                        <span className="linkSpan">{links.map((item) => (
                            <Link key={item.label} to={item.path} style={{all:'unset', textDecoration:'underline'}} className="link">{item.label}</Link>
                        ))}</span>
                    </div>
                ))}
            </section>
            <section className="footerBottom">
                © {new Date().getFullYear()} CitySewa. All Rights Reserved.
            </section>
        </footer>
    );
};

export default Footer;