import Footer from "../components/common/Footer/Footer";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/admin/sidebar";
import { useState } from "react";
import "./../Style/Layouts.css";

const AdminLayout = () => {
    const [activeSection, setActiveSection] = useState("Customers");
    return(
        <main className="admin-layout">
            <span className="admin-panel">
                <Sidebar setActiveSection={setActiveSection}/>
                <Outlet context={{activeSection}}/>
            </span>
            <Footer type='admin'/>
        </main>
    );
};

export default AdminLayout;