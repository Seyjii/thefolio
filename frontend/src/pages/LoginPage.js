import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(email, password);
      navigate(user.role === 'admin' ? '/admin' : '/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <section className="register-content">
      <div className="container">
        <h2>Welcome Back</h2>
        
        <form className="register-form" onSubmit={handleSubmit}>
          <h3>Login to Your Account</h3>
          
          {error && <span className="error-message" style={{display: 'block', textAlign: 'center', marginBottom: '20px', fontSize: '14px'}}>{error}</span>}
          
          <label htmlFor="email">Email Address:</label>
          <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" required className={error ? 'invalid' : ''} />
          
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required className={error ? 'invalid' : ''} />
          
          <button type="submit" className="btn" style={{width: '100%', marginTop: '10px'}}>Login</button>
          
          <p style={{textAlign: 'center', marginTop: '20px', color: 'var(--text-primary)'}}>
            Don't have an account? <Link to="/register" style={{color: 'var(--border-accent)', fontWeight: '600', textDecoration: 'none'}}>Register here</Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export default LoginPage;