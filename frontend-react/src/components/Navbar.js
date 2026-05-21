import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        // Load user data when token changes
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            setUser(null);
        }
    }, [token]);

    // Listen for storage changes (when login happens in another tab)
    useEffect(() => {
        const handleStorageChange = () => {
            setToken(localStorage.getItem('token'));
            const userData = localStorage.getItem('user');
            if (userData) {
                setUser(JSON.parse(userData));
            } else {
                setUser(null);
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/">VCIP</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/developers">Developers</Link></li>
                        
                        {/* Compiler Link - Shows for all logged-in users */}
                        {token && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/compiler">
                                    💻 Compiler
                                </Link>
                            </li>
                        )}
                        
                        {!token ? (
                            // Not logged in
                            <>
                                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
                            </>
                        ) : (
                            // Logged in - show role-based links
                            <>
                                {user?.role === 'candidate' && (
                                    <li className="nav-item"><Link className="nav-link" to="/candidate-dashboard">Dashboard</Link></li>
                                )}
                                {user?.role === 'interviewer' && (
                                    <>
                                        <li className="nav-item"><Link className="nav-link" to="/interviewer-dashboard">Dashboard</Link></li>
                                        <li className="nav-item"><Link className="nav-link" to="/create-question">Create Question</Link></li>
                                    </>
                                )}
                                {user?.role === 'admin' && (
                                    <li className="nav-item"><Link className="nav-link" to="/admin">Admin Panel</Link></li>
                                )}
                                <li className="nav-item"><span className="nav-link text-light">Hello, {user?.fullName || user?.username}</span></li>
                                <li className="nav-item">
                                    <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;