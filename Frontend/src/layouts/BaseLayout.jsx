import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar/NavBar";
import Footer from "../components/common/Footer/Footer";

const BaseLayout = () => {
    return(
        <main>
            {/* <Navbar/> */}
            <section><Outlet/></section>
            {/* <Footer/> */}
        </main>
    );
}; 

export default BaseLayout;