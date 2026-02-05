import Footer from "../components/common/Footer/Footer";
import { Outlet } from "react-router-dom";
import "../style/Layouts.css";

const AdminLayout = () => {
    return(
        <main className="admin-layout">
            <Outlet />
            <Footer />
        </main>
    );
};

export default AdminLayout;