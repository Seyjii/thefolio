// src/components/Navbar.js
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function Navbar({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  
  // Phase 2: Hook into the authentication state
  const { user, logout } = useAuth(); 

  // Theme logic
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* 1. The Navigation (Top) */}
      <header>
        <div className="container">
          <h1 className="logo">My Portfolio</h1>
          <nav>
            <ul>
              <li><Link to="/home" className={location.pathname === '/home' ? 'active' : ''}>Home</Link></li>
              <li><Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link></li>
              <li><Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact</Link></li>
              <li><Link to="/game" className={location.pathname === '/game' ? 'active' : ''}>Game</Link></li>
              
              {/* Dynamic Links: Show these only if logged in */}
              {user ? (
                <>
                  <li><Link to="/create-post" className={location.pathname === '/create-post' ? 'active' : ''}>Write Post</Link></li>
                  <li><Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>Profile</Link></li>
                  
                  {/* Admin Only Link */}
                  {user.role === 'admin' && (
                    <li><Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>Admin</Link></li>
                  )}
                  
                  <li>
                    <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', padding: '5px 0', fontWeight: '500' }}>
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                /* Show these if NOT logged in */
                <>
                  <li><Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>Login</Link></li>
                  <li><Link to="/register" className={location.pathname === '/register' ? 'active' : ''}>Register</Link></li>
                </>
              )}
              
              <li>
                <button id="theme-toggle" onClick={toggleTheme} title="Toggle Dark Mode">
                  {isDark ? '☀️' : '🌙'}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* 2. The Dynamic Page Content (Middle) */}
      <main>
        {children}
      </main>

      {/* 3. The Footer (Bottom) */}
      <footer>
        <div className="container">
          <p>Email: sijey@gmail.com</p>
          <p>&copy; 2026 My Personal Portfolio. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default Navbar;