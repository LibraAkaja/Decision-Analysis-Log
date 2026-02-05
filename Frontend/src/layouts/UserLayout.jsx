import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/NavBar";
import Footer from "../components/Footer/Footer";
import "./../style/Layouts.css";

const UserLayout = () => {
    return(
        <main style={{display:'flex', justifyContent:'space-evenly', alignItems:'center', width:'100%', border:'2px solid white', flexDirection:'column'}}>
            <Navbar type='user'/>
            <section><Outlet/></section>
            <Footer type='user'/>
        </main>
    );
};

export default UserLayout;
