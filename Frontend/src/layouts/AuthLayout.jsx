import { Outlet } from "react-router-dom";

const AuthLayout = () => {
    return(
        <main className="auth-layout" style={{display:'flex', justifyContent:'space-evenly', alignItems:'center', width:'100%', flexWrap:'wrap'}}>
            <Outlet/>
        </main>
    );
};
// , border:'2px solid yellow'
export default AuthLayout;