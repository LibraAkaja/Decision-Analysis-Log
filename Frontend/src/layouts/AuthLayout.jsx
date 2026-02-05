import { Outlet } from "react-router-dom";
import "../style/Layouts.css";

const AuthLayout = () => {
    return(
        <main className="auth-layout">
            <Outlet/>
        </main>
    );
};

export default AuthLayout;