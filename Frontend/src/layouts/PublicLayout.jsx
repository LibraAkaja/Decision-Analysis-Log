import Navbar from "../components/common/Navbar/NavBar";
import Footer from "../components/common/Footer/Footer";
import { Outlet } from "react-router-dom";
import "../style/Root.css";
import "../style/Layouts.css";

const PublicLayout = () => {
    return(
        <main className="public-layout">
            <Navbar />
            <section><Outlet/></section>
            <Footer />
        </main>
    );
};

export default PublicLayout;