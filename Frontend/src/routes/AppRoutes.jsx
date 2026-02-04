import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

// Import Auth pages
import Login from '../pages/auth/login/Login.jsx';
import LoginAdmin from '../pages/auth/login/LoginAdmin.jsx';
import ForgotPassword from '../pages/auth/ForgotPassword';

// Import Landing page
import Home from '../pages/Home.jsx';
import About from '../pages/About.jsx';

// Import Dashboard
import AdminDashboard from '../pages/dashboard/admin/AdminDashboard.jsx';
import UserDashboard from '../pages/dashboard/UserDashboard.jsx';

// Import Profiles
import CustomerProfile from '../pages/profiles/CustomerProfile';
import ProviderProfile from '../pages/profiles/ProviderProfile';

// Import Not found page
import NotFound from '../pages/NotFound';

// Import Layouts
import PublicLayout from '../layouts/PublicLayout';
import AuthLayout from '../layouts/AuthLayout';
import CustomerLayout from '../layouts/CustomerLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProviderLayout from '../layouts/ProviderLayout';

// Import protected route
import ProtectedRoute from './ProtectedRoute.jsx';

const AppRoutes = ()=> (
    <Router>
        <Routes>

            {/* Public Routes */}
            <Route element={<PublicLayout/>}>
                <Route path='/' element={<Home/>}/>
                <Route path='services' element={<Services/>}/>
                <Route path='/services/:id' element={<ServiceDetail/>}/>
                <Route path='/about' element={<About/>}/>
            </Route>

            {/* Auth Routes */}
            <Route element={<AuthLayout/>}>
                <Route path='/login' element={<Login/>}/>
                <Route path='/login-admin' element={<LoginAdmin/>}/>
                <Route path='/register' element={<Register/>}/>
                <Route path='/register-admin' element={<RegisterAdmin/>}/>
                <Route path='/forgot-password' element={<ForgotPassword/>}/>
            </Route>

            {/* Protected Routes for After Login */}

            <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
                <Route element={<CustomerLayout/>}>
                    <Route path='/customer' element={<CustomerDashboard/>}/>
                    {/* <Route path='/customer/bookings' element={<Bookings/>}/> */}
                    <Route path='/customer/bookings/:id' element={<BookingDetail/>}/>
                    <Route path='/customer/bookings/new/:serviceId' element={<BookingForm/>}/>
                    <Route path='/customer/addresses' element={<Addresses/>}/>
                    <Route path='/customer/addresses/new' element={<AddressForm/>}/>
                    <Route path='/customer/profile' element={<CustomerProfile/>}/>
                </Route>
            </Route>
            
            <Route element={<ProtectedRoute allowedRoles={["provider"]} />}>
                <Route element={<ProviderLayout/>}>
                    <Route path='/provider' element={<ProviderDashboard/>}/>
                    <Route path='/provider/services' element={<Services/>}/>
                    <Route path='/provider/services/new' element={<ServiceForm/>}/>
                    <Route path='/provider/services/:id' element={<ServiceDetail/>}/>
                    {/* <Route path='/provider/bookings' element={<Bookings/>}/> */}
                    <Route path='/provider/profile' element={<ProviderProfile/>}/>
                </Route>
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                <Route element={<AdminLayout/>}>
                    <Route path='/admin' element={<AdminDashboard/>}/>
                    {/* <Route path='/admin/bookings' element={<Bookings/>}/> */}
                    <Route path='/admin/users' element={<CustomerProfile/>}/>
                    <Route path='/admin/services' element={<Services/>}/>
                </Route>
            </Route>

            {/* Fallback */}
            <Route path='*' element={<NotFound/>}/>
        
        </Routes>
    </Router>
);

export default AppRoutes;

