import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar/NavBar";
import Footer from "../components/common/Footer/Footer";
import "../style/Layouts.css";

const UserLayout = () => {
    return(
        <main className="user-layout">
            <Navbar />
            <section><Outlet/></section>
            <Footer />
        </main>
    );
};

export default UserLayout;
