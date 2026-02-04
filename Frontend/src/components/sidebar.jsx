import "../../Style/Root.css";
import "../../Style/Sidebar.css";

const Sidebar = ({setActiveSection}) => {
    return(
        <section className="admin-sidebar">
            <button onClick={() => setActiveSection("Customers")}><span>Customers</span></button>
            <button onClick={() => setActiveSection("Providers")}><span>Providers</span></button>
            <button onClick={() => setActiveSection("Bookings")}><span>Bookings</span></button>
            <button onClick={() => setActiveSection("Services")}><span>Services</span></button>
            <button onClick={() => setActiveSection("Verification")}><span>Verification Request</span></button>
        </section>
    );
};

export default Sidebar;