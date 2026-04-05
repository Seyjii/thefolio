// src/pages/RegisterPage.js
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios'; // Phase 2 API

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: '', username: '', email: '', gender: '', dob: '', password: '', confirmPassword: '', level: '', terms: false
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    setErrors({ ...errors, [name]: '' });
  };

  const validateRegisterForm = async (e) => { // Changed to async
    e.preventDefault();
    let newErrors = {};
    let isValid = true;

    // --- Validation Logic (Unchanged from Phase 1) ---
    if (formData.fullname.trim() === "") { newErrors.fullname = "Full Name is required"; isValid = false; }
    if (formData.username.trim() === "") { newErrors.username = "Username is required"; isValid = false; } 
    else if (formData.username.length < 3) { newErrors.username = "Username must be at least 3 characters long"; isValid = false; }
    if (formData.email.trim() === "") { newErrors.email = "Email is required"; isValid = false; } 
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { newErrors.email = "Please enter a valid email address"; isValid = false; }
    if (formData.gender === "") { newErrors.gender = "Please select your gender"; isValid = false; }
    if (formData.dob === "") { newErrors.dob = "Birthday is required"; isValid = false; } 
    else {
        let dobDate = new Date(formData.dob);
        let today = new Date();
        let age = today.getFullYear() - dobDate.getFullYear();
        let monthDiff = today.getMonth() - dobDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) { age--; }
        if (age < 18) { newErrors.dob = "You must be at least 18 years old to register"; isValid = false; }
    }
    if (formData.password === "") { newErrors.password = "Password is required"; isValid = false; } 
    else if (formData.password.length < 6) { newErrors.password = "Password must be at least 6 characters long"; isValid = false; }
    if (formData.confirmPassword === "") { newErrors.confirmPassword = "Please confirm your password"; isValid = false; } 
    else if (formData.password !== formData.confirmPassword) { newErrors.confirmPassword = "Passwords do not match"; isValid = false; }
    if (!formData.level) { newErrors.level = "Please select your knowledge level"; isValid = false; }
    if (!formData.terms) { newErrors.terms = "You must agree to the terms and conditions"; isValid = false; }

    setErrors(newErrors);

    // --- Phase 2 Backend Integration ---
    if (isValid) {
      try {
        // Map Phase 1 fields to Phase 2 Backend requirements
        const payload = {
            name: formData.fullname,
            email: formData.email,
            password: formData.password
        };
        
        const { data } = await API.post('/auth/register', payload);
        localStorage.setItem('token', data.token);
        
        alert("Registration successful! Welcome, " + formData.username + "!");
        navigate('/home'); // Redirect to home after successful registration
      } catch (err) {
        setErrors({ ...errors, server: err.response?.data?.message || 'Registration failed.' });
      }
    }
  };

  return (
    <section className="register-content">
      <div className="container">
        <h2>Join Our Community</h2>
        
        <div className="register-info">
          <img src="/assets/register.jpg" alt="Three friends holding PlayStation 5 controllers ready for a multiplayer gaming session." />
          <h3>What You'll Get</h3>
          <p>When you sign up, you'll receive updates about new gaming tips, movie recommendations, and coding projects I'm working on. It's a great way to stay connected and share our interests!</p>
          <p>No spam, just cool stuff about gaming, movies, and tech. You can unsubscribe anytime if you change your mind.</p>
        </div>

        <form className="register-form" id="registerForm" onSubmit={validateRegisterForm}>
          <h3>Sign Up Now</h3>
          
          {/* Display Server Errors if email is already taken */}
          {errors.server && <span className="error-message" style={{textAlign: 'center', fontSize: '16px', display: 'block', marginBottom: '20px'}}>{errors.server}</span>}
          
          <label htmlFor="fullname">Full Name:</label>
          <input type="text" id="fullname" name="fullname" placeholder="Enter your full name" value={formData.fullname} onChange={handleChange} className={errors.fullname ? 'invalid' : ''} />
          <span className="error-message" id="fullnameError">{errors.fullname}</span>

          <label htmlFor="username">Preferred Username:</label>
          <input type="text" id="username" name="username" placeholder="Choose a username" value={formData.username} onChange={handleChange} className={errors.username ? 'invalid' : ''} />
          <span className="error-message" id="usernameError">{errors.username}</span>

          <label htmlFor="email">Email Address:</label>
          <input type="email" id="email" name="email" placeholder="your.email@example.com" value={formData.email} onChange={handleChange} className={errors.email ? 'invalid' : ''} />
          <span className="error-message" id="emailError">{errors.email}</span>

          <label htmlFor="gender">Gender:</label>
          <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className={errors.gender ? 'invalid' : ''}>
            <option value="" disabled>Select your gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <span className="error-message" id="genderError">{errors.gender}</span>

          <label htmlFor="dob">Date of Birth:</label>
          <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} className={errors.dob ? 'invalid' : ''} />
          <span className="error-message" id="dobError">{errors.dob}</span>

          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" placeholder="Create a password" value={formData.password} onChange={handleChange} className={errors.password ? 'invalid' : ''} />
          <span className="error-message" id="passwordError">{errors.password}</span>

          <label htmlFor="confirm-password">Confirm Password:</label>
          <input type="password" id="confirm-password" name="confirmPassword" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} className={errors.confirmPassword ? 'invalid' : ''} />
          <span className="error-message" id="confirmPasswordError">{errors.confirmPassword}</span>

          <div className="radio-group">
            <label className="group-label">Knowledge Level:</label>
            <div className="radio-options">
              <label><input type="radio" id="beginner" name="level" value="beginner" checked={formData.level === 'beginner'} onChange={handleChange} /> Beginner</label>
              <label><input type="radio" id="intermediate" name="level" value="intermediate" checked={formData.level === 'intermediate'} onChange={handleChange} /> Intermediate</label>
              <label><input type="radio" id="expert" name="level" value="expert" checked={formData.level === 'expert'} onChange={handleChange} /> Expert</label>
            </div>
            <span className="error-message" id="levelError">{errors.level}</span>
          </div>

          <div className="checkbox-group">
            <input type="checkbox" id="terms" name="terms" checked={formData.terms} onChange={handleChange} />
            <label htmlFor="terms">I agree to the terms and conditions</label>
          </div>
          <span className="error-message" id="termsError">{errors.terms}</span>

          <button type="submit" className="btn">Register Now</button>
        </form>
      </div>
    </section>
  );
}

export default RegisterPage;