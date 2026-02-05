import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import {
    getAllUsers,
    updateUserRole,
    deleteUser,
    getAdminDashboard,
} from '../../../api/client';
import '../../style/Admin.css';

function AdminDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadAdminData();
    }, []);

    const loadAdminData = async () => {
        try {
            setLoading(true);
            const [usersRes, statsRes] = await Promise.all([
                getAllUsers(),
                getAdminDashboard(),
            ]);
            setUsers(usersRes.data || []);
            setStats(statsRes.data);
            setError('');
        } catch (err) {
            setError('Failed to load admin data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePromoteUser = async (userId) => {
        try {
            await updateUserRole(userId, { role: 'admin' });
            loadAdminData();
            setError('');
        } catch (err) {
            setError('Failed to promote user');
        }
    };

    const handleDemoteUser = async (userId) => {
        try {
            await updateUserRole(userId, { role: 'user' });
            loadAdminData();
            setError('');
        } catch (err) {
            setError('Failed to demote user');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user? This will delete all their data.')) return;

        try {
            await deleteUser(userId);
            loadAdminData();
            setError('');
        } catch (err) {
            setError('Failed to delete user');
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="admin-container">
            {/* Header */}
            <header className="admin-header">
                <div>
                    <h1>Admin Dashboard</h1>
                    <p>Welcome, {user?.email}</p>
                </div>
                <button onClick={handleLogout} className="btn-logout">Logout</button>
            </header>

            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <p className="loading">Loading...</p>
            ) : (
                <>
                    {/* Stats */}
                    {stats && (
                        <div className="stats-grid">
                            <div className="stat-card">
                                <h3>Total Users</h3>
                                <p className="stat-number">{stats.total_users}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Total Admins</h3>
                                <p className="stat-number">{stats.total_admins}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Total Decisions</h3>
                                <p className="stat-number">{stats.total_decisions}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Total Options</h3>
                                <p className="stat-number">{stats.total_options}</p>
                            </div>
                        </div>
                    )}

                    {/* Users Table */}
                    <div className="users-section">
                        <h2>Manage Users</h2>
                        {users.length === 0 ? (
                            <p>No users found</p>
                        ) : (
                            <div className="users-table">
                                {users.map((u) => (
                                    <div key={u.id} className="user-row">
                                        <div className="user-info">
                                            <p className="user-email">{u.email}</p>
                                            <span className={`role-badge role-${u.role}`}>
                                                {u.role}
                                            </span>
                                        </div>
                                        <div className="user-actions">
                                            {u.role === 'user' ? (
                                                <button
                                                    onClick={() => handlePromoteUser(u.id)}
                                                    className="btn-promote"
                                                >
                                                    Promote to Admin
                                                </button>
                                            ) : u.role === 'admin' && u.id !== user?.id ? (
                                                <button
                                                    onClick={() => handleDemoteUser(u.id)}
                                                    className="btn-demote"
                                                >
                                                    Demote to User
                                                </button>
                                            ) : null}
                                            {u.id !== user?.id && (
                                                <button
                                                    onClick={() => handleDeleteUser(u.id)}
                                                    className="btn-delete"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default AdminDashboard;