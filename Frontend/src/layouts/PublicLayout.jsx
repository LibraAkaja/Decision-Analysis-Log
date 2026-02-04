import Navbar from "../components/common/Navbar/NavBar";
import Footer from "../components/common/Footer/Footer";
import { Outlet } from "react-router-dom";
import "./../Style/Root.css";
import "./../Style/Layouts.css";

const PublicLayout = () => {
    return(
        <main className="public-layout">
            <Navbar type='public'/>
            <section><Outlet/></section>
            <Footer type='public'/>
        </main>
    );
};

export default PublicLayout;