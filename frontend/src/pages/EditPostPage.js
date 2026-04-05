import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api/axios';

function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    API.get(`/posts/${id}`).then(res => {
      setTitle(res.data.title);
      setBody(res.data.body);
    }).catch(err => setError('Could not load post data.'));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/posts/${id}`, { title, body });
      navigate(`/posts/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post');
    }
  };

  return (
    <section className="contact-content">
      <div className="container">
        <h2>Edit Post</h2>
        <form className="contact-form" onSubmit={handleSubmit}>
          {error && <span className="error-message">{error}</span>}
          <label>Post Title:</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
          <label>Post Body:</label>
          <textarea value={body} onChange={e => setBody(e.target.value)} rows="8" required></textarea>
          <button type="submit" className="btn">Save Changes</button>
        </form>
      </div>
    </section>
  );
}

export default EditPostPage;