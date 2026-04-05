import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

function ProfilePage() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [pic, setPic] = useState(null);
  
  const [curPw, setCurPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [msg, setMsg] = useState('');

  const handleProfile = async (e) => {
    e.preventDefault(); 
    setMsg('');
    const fd = new FormData();
    fd.append('name', name);
    fd.append('bio', bio);
    if (pic) fd.append('profilePic', pic);
    
    try {
      const { data } = await API.put('/auth/profile', fd);
      setUser(data);
      setMsg('Profile updated successfully!');
    } catch (err) { 
      setMsg(err.response?.data?.message || 'Error updating profile'); 
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault(); 
    setMsg('');
    try {
      await API.put('/auth/change-password', { currentPassword: curPw, newPassword: newPw });
      setMsg('Password changed successfully!');
      setCurPw(''); setNewPw('');
    } catch (err) { 
      setMsg(err.response?.data?.message || 'Error changing password'); 
    }
  };

  const picSrc = user?.profilePic 
    ? `http://localhost:5000/uploads/${user.profilePic}` 
    : '/assets/about1.jpg'; // Fallback to one of your phase 1 assets

  return (
    <section className="contact-content">
      <div className="container">
        <h2>My Settings</h2>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <img src={picSrc} alt="Profile" style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--border-accent)', boxShadow: '0 10px 30px var(--shadow-medium)' }} />
        </div>

        {msg && <p className="error-message" style={{textAlign: 'center', color: 'var(--border-accent)', fontSize: '16px'}}>{msg}</p>}

        <form className="contact-form" onSubmit={handleProfile}>
          <h3>Edit Profile</h3>
          
          <label>Display Name:</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your display name" />
          
          <label>Short Bio:</label>
          <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell us about your favorite games or movies..." rows="3"></textarea>
          
          <label>Update Profile Picture:</label>
          <input type="file" accept="image/*" onChange={e => setPic(e.target.files[0])} style={{border: 'none', background: 'transparent', padding: '10px 0'}} />
          
          <button type="submit" className="btn">Save Profile</button>
        </form>

        <form className="contact-form" onSubmit={handlePassword} style={{marginTop: '40px'}}>
          <h3>Change Password</h3>
          
          <label>Current Password:</label>
          <input type="password" value={curPw} onChange={e => setCurPw(e.target.value)} required />
          
          <label>New Password:</label>
          <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} required minLength={6} placeholder="Min 6 characters" />
          
          <button type="submit" className="btn">Update Password</button>
        </form>
      </div>
    </section>
  );
}

export default ProfilePage;