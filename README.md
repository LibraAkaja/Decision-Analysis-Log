# Decision Analyzer Log

A modern, minimal React frontend for making better decisions through structured analysis and option evaluation.

##  Overview

Decision Analyzer helps users organize their thoughts, evaluate options with ratings, and make informed decisions. This frontend provides an intuitive interface for decision management, option evaluation, and administrative oversight.

**Live Demo:** [Deployed on Vercel](https://decision-analyzer-log.vercel.app)

##  Features

- **User Authentication** - Secure registration and login with JWT tokens
- **Decision Management** - Create, view, edit, and delete decisions
- **Option Evaluation** - Add options to decisions with 1-5 rating system
- **Admin Dashboard** - User management, role promotion, platform statistics
- **Role-Based Access** - User and admin roles with different permissions
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Dark Theme** - Modern glassmorphic UI with smooth animations

##  Tech Stack

- **Framework:** React 19.2.0
- **Build Tool:** Vite 7.3.1
- **Routing:** React Router DOM 6.20.0
- **HTTP Client:** Axios 1.7.7
- **Styling:** CSS3 with CSS Variables
- **State Management:** React Context API
- **Authentication:** Supabase JWT

##  Prerequisites

- Node.js 16+ and npm/yarn
- Backend API running (or use production URL)
- Supabase account (for authentication)

##  Getting Started

### Installation

\\\ash
# Clone the repository
git clone <repository-url>
cd Frontend

# Install dependencies
npm install
\\\

### Environment Variables

Create a \.env\ file in the Frontend directory:

\\\env
VITE_API_URL=https://decision-analyzer-log-backend.onrender.com/api/v1
\\\

For local development:
\\\env
VITE_API_URL=http://localhost:8000/api/v1
\\\

### Running Locally

\\\ash
# Start development server
npm run dev

# Visit http://localhost:5173
\\\

### Build for Production

\\\ash
npm run build
npm run preview
\\\

##  Project Structure

\\\
src/
 App.jsx                          # Root component
 main.jsx                         # Entry point
 api/
    client.js                    # Axios API client with interceptors
    supabaseClient.js            # Supabase configuration
 context/
    AuthContext.jsx              # Authentication state management
 routes/
    AppRoutes.jsx                # Route definitions
    ProtectedRoute.jsx           # Route protection wrapper
 pages/
    Home.jsx                     # Landing page
    NotFound.jsx                 # 404 page
    auth/
       Login.jsx                # Login form
       Register.jsx             # Registration form
       style/Auth.css           # Auth styling
    dashboard/
       UserDashboard.jsx        # User decision management
       admin/
          AdminDashboard.jsx   # Admin panel
       style/Dashboard.css      # Dashboard styling
    style/
        Home.css
        NotFound.css
        Admin.css
 layouts/
    PublicLayout.jsx             # Public pages layout
    AuthLayout.jsx               # Auth pages layout
    UserLayout.jsx               # User pages layout
    AdminLayout.jsx              # Admin pages layout
 components/
    Navbar/NavBar.jsx            # Navigation component
    Footer/Footer.jsx            # Footer component
    sidebar.jsx                  # Admin sidebar
 style/
     Root.css                     # Global styles & theme variables
     Home.css
     Navbar.css
     Footer.css
     Sidebar.css
\\\

##  Authentication Flow

1. **Register**  User creates account with email/password
2. **Auto-Login**  New user automatically logged in
3. **Token Storage**  JWT tokens stored in localStorage
4. **Dashboard Access**  User redirected to \/dashboard\
5. **Protected Routes**  Routes check authentication before rendering
6. **Role Check**  Admin routes verify \
ole === 'admin'\
7. **Logout**  Clears tokens and redirects to login

### API Endpoints

**Authentication:**
- \POST /auth/register\ - Register new user
- \POST /auth/login\ - Login user
- \POST /auth/refresh\ - Refresh token
- \GET /auth/me\ - Get current user profile
- \POST /auth/logout\ - Logout user

**Decisions:**
- \GET /decisions\ - Get all user decisions
- \POST /decisions\ - Create new decision
- \GET /decisions/{id}\ - Get decision with options
- \PATCH /decisions/{id}\ - Update decision
- \DELETE /decisions/{id}\ - Delete decision

**Options:**
- \POST /options\ - Add option to decision
- \GET /options/{decision_id}\ - Get options for decision
- \PATCH /options/{id}\ - Update option
- \DELETE /options/{id}\ - Delete option

**Admin:**
- \GET /admin/users\ - Get all users
- \PATCH /admin/users/{id}/role\ - Update user role
- \DELETE /admin/users/{id}\ - Delete user
- \GET /admin/dashboard\ - Get platform statistics

### Design System

- **Glassmorphism:** Frosted glass cards with backdrop blur
- **Responsive:** Mobile-first design with breakpoints at 1024px and 768px
- **Dark Mode:** Complete dark theme with blue accents
- **Smooth Transitions:** 0.3s ease animations

##  Testing Workflows

### User Flow

\\\
1. Visit http://localhost:5173  Home page
2. Click "Register"  Fill form  Submit
3. Auto-redirects to /dashboard
4. Create decision  Add options (1-5 rating)
5. Edit/delete options and decisions
6. Click logout  Back to login
\\\

### Admin Flow

\\\
1. Register as regular user
2. (Backend) Promote user to admin role
3. Login  Can access /admin
4. View users, statistics
5. Promote/demote users
6. Delete users
\\\

##  Dependencies

\\\json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^6.20.0",
  "axios": "^1.7.7"
}
\\\

##  Deployment

### Deploy to Vercel

1. **Push to GitHub**
   \\\ash
   git push origin main
   \\\

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Import the repository
   - Set environment variable: \VITE_API_URL=https://decision-analyzer-log-backend.onrender.com/api/v1\
   - Deploy

3. **Verify Deployment**
   - Frontend: https://decision-analyzer-log.vercel.app
   - Backend: https://decision-analyzer-log-backend.onrender.com/api/v1

##  Troubleshooting

### Issue: "Failed to resolve import 'react-router-dom'"
**Solution:** Run \
pm install\

### Issue: CORS errors
**Solution:** Ensure backend \VITE_API_URL\ in \.env\ is correct

### Issue: Token errors on login
**Solution:** Check localStorage for \ccessToken\ in DevTools

### Issue: Admin routes showing 404
**Solution:** Ensure user role is 'admin' in database

##  Best Practices

- Keep components focused and reusable
- Use React Context for state management
- Leverage CSS variables for theming
- Handle loading and error states
- Validate form inputs before submission
- Use semantic HTML

##  Development Workflow

\\\ash
# Start dev server with HMR
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
\\\

##  License

This project is part of the Decision Analyzer Log suite.

##  Support

For issues or questions, contact the LibraAkaja or open an issue on GitHub.
