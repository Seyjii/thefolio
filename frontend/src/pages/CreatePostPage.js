import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError('');
    const fd = new FormData();
    fd.append('title', title);
    fd.append('body', body);
    if (image) fd.append('image', image);
    
    try {
      const { data } = await API.post('/posts', fd);
      navigate(`/posts/${data._id}`);
    } catch (err) { 
      setError(err.response?.data?.message || 'Failed to publish post'); 
    }
  };

  return (
    <section className="contact-content">
      <div className="container">
        <h2>Write a New Post</h2>
        
        <form className="contact-form" onSubmit={handleSubmit}>
          {error && <span className="error-message">{error}</span>}
          
          <label>Post Title:</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="What's on your mind?" required />
          
          <label>Post Body:</label>
          <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Share your thoughts..." rows="8" required></textarea>
          
          {user?.role === 'admin' && (
            <div style={{marginBottom: '20px'}}>
              <label>Upload Cover Image (Admin Only): </label>
              <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} style={{border: 'none', background: 'transparent', padding: '10px 0'}} />
            </div>
          )}
          
          <button type="submit" className="btn">Publish Post</button>
        </form>
      </div>
    </section>
  );
}

export default CreatePostPage;