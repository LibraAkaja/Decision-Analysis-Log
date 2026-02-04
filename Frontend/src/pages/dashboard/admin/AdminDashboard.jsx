import "../../../Style/Dashboard.css";
import Customers from "./CustomerTable";
import Providers from "./ProviderTable";
import VerificationRequests from "./VerificationRequestsTable";
import { useOutletContext } from "react-router-dom";

const AdminDashboard = (e) => {
    const {activeSection} = useOutletContext();
    const renderContext = () => {
        switch(activeSection){
            case "Customers":
                return <Customers/>
            case "Providers":
                return <Providers/>
            case "Verification":
                return <VerificationRequests/>
            default:
                return null;
        }
    };
    return(
        <section className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            {renderContext()}
        </section>
    );
};

export default AdminDashboard;