import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

function PostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/posts/${id}`)
      .then(res => setPost(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await API.delete(`/posts/${id}`);
        navigate('/home');
      } catch (err) {
        alert("Failed to delete post");
      }
    }
  };

  if (loading) return <div style={{textAlign: 'center', padding: '100px'}}>Loading...</div>;
  if (!post) return <div style={{textAlign: 'center', padding: '100px'}}>Post not found.</div>;

  const isOwnerOrAdmin = user && (user._id === post.author?._id || user.role === 'admin');

  return (
    <section className="about-content">
      <div className="container">
        
        <div className="about-section" style={{ alignItems: 'flex-start', textAlign: 'left' }}>
          <h2 style={{ marginBottom: '10px', fontSize: '36px', textAlign: 'left' }}>{post.title}</h2>
          
          <p style={{ color: 'var(--text-secondary)', fontWeight: 'bold', marginBottom: '20px' }}>
            By {post.author?.name} | {new Date(post.createdAt).toLocaleDateString()}
          </p>

          {post.image && (
            <img src={`${process.env.REACT_APP_API_URL?.replace('/api', '')}/uploads/${post.image}`} alt={post.title} style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }} />
          )}

          <p style={{ whiteSpace: 'pre-wrap', width: '100%' }}>{post.body}</p>

          {isOwnerOrAdmin && (
            <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
              <Link to={`/edit-post/${post._id}`} className="btn">Edit Post</Link>
              <button onClick={handleDelete} className="btn" style={{ background: '#ff4d4d' }}>Delete Post</button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

export default PostPage;