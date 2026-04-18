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
  
  // New state for comments
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentError, setCommentError] = useState('');

  useEffect(() => {
    // Fetch both the post and its comments simultaneously
    Promise.all([
      API.get(`/posts/${id}`),
      API.get(`/comments/${id}`) // Calling your existing comment route!
    ])
      .then(([postRes, commentsRes]) => {
        setPost(postRes.data);
        setComments(commentsRes.data);
      })
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

  // Function to handle submitting a new comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentError('');
    
    try {
      // Notice: Your backend uses req.body.body for the comment text!
      const res = await API.post(`/comments/${id}`, { body: newComment });
      
      // Add the new comment to the list so it appears instantly
      setComments([...comments, res.data]);
      setNewComment(''); // Clear the input
    } catch (err) {
      setCommentError(err.response?.data?.message || 'Failed to post comment');
    }
  };

  // Function to handle deleting a comment
  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Delete this comment?")) {
      try {
        await API.delete(`/comments/${commentId}`);
        // Remove it from the screen
        setComments(comments.filter(c => c._id !== commentId));
      } catch (err) {
        alert("Failed to delete comment");
      }
    }
  };

  if (loading) return <div style={{textAlign: 'center', padding: '100px'}}>Loading...</div>;
  if (!post) return <div style={{textAlign: 'center', padding: '100px'}}>Post not found.</div>;

  const isOwnerOrAdmin = user && (user._id === post.author?._id || user.role === 'admin');

  return (
    <section className="about-content">
      <div className="container">
        
        {/* Post Content */}
        <div className="about-section" style={{ alignItems: 'flex-start', textAlign: 'left' }}>
          <h2 style={{ marginBottom: '10px', fontSize: '36px', textAlign: 'left' }}>{post.title}</h2>
          
          <p style={{ color: 'var(--text-secondary)', fontWeight: 'bold', marginBottom: '20px' }}>
            By {post.author?.name} | {new Date(post.createdAt).toLocaleDateString()}
          </p>

          {post.image && (
            <img 
              src={post.image.startsWith('http') ? post.image : `${process.env.REACT_APP_API_URL?.replace('/api', '')}/uploads/${post.image}`} 
              alt={post.title} 
              style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }} 
            />
          )}

          <p style={{ whiteSpace: 'pre-wrap', width: '100%' }}>{post.body}</p>

          {isOwnerOrAdmin && (
            <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
              <Link to={`/edit-post/${post._id}`} className="btn">Edit Post</Link>
              <button onClick={handleDelete} className="btn" style={{ background: '#ff4d4d' }}>Delete Post</button>
            </div>
          )}
        </div>

        <hr style={{ margin: '40px 0', border: '1px solid #eee' }} />

        {/* --- COMMENT SECTION --- */}
        <div className="comments-section" style={{ textAlign: 'left', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
          <h3 style={{ marginBottom: '20px' }}>Comments ({comments.length})</h3>

          {/* Comment Input */}
          {user ? (
            <form onSubmit={handleCommentSubmit} style={{ marginBottom: '30px' }}>
              {commentError && <p style={{ color: 'red', marginBottom: '10px' }}>{commentError}</p>}
              <textarea 
                value={newComment} 
                onChange={(e) => setNewComment(e.target.value)} 
                placeholder="Join the discussion..." 
                rows="3"
                required
                style={{ width: '100%', padding: '15px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
              ></textarea>
              <button type="submit" className="btn">Post Comment</button>
            </form>
          ) : (
            <p style={{ marginBottom: '30px', fontStyle: 'italic' }}>Please log in to leave a comment.</p>
          )}

          {/* Comment List */}
          <div className="comment-list">
            {comments.map((comment) => {
              const isCommentOwnerOrAdmin = user && (user._id === comment.author?._id || user.role === 'admin');
              
              return (
                <div key={comment._id} style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <strong>{comment.author?.name || 'Unknown User'}</strong>
                    <span style={{ fontSize: '0.85em', color: '#888' }}>
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p style={{ margin: '0' }}>{comment.body}</p>
                  
                  {/* Delete button for comment author or admin */}
                  {isCommentOwnerOrAdmin && (
                    <button 
                      onClick={() => handleDeleteComment(comment._id)} 
                      style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '0.85em', marginTop: '10px', padding: 0 }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              );
            })}
            
            {comments.length === 0 && <p>No comments yet. Be the first to share your thoughts!</p>}
          </div>
        </div>

      </div>
    </section>
  );
}

export default PostPage;