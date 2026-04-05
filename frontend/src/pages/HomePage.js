import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch posts from the backend on page load [cite: 1115-1121]
  useEffect(() => {
    API.get('/posts')
      .then(res => setPosts(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* 1. ORIGINAL HERO SECTION */}
      <section className="hero">
        <div className="container">
          <h2>Welcome to My World</h2>
          <p>I'm a student who loves gaming, watching movies, and learning to code. This is where I share my passions and experiences!</p>
          <img src="/assets/home.jpg" alt="A professional gaming desk setup with a high-end PC and purple neon ambient lighting." />
        </div>
      </section>

      {/* 2. ORIGINAL HIGHLIGHTS SECTION */}
      <section className="highlights">
        <div className="container">
          <h3>What I Love</h3>
          <ul>
            <li>Playing MOBA games and shooting games for fun and challenge</li>
            <li>Watching thriller, horror, and action movies because they're not boring</li>
            <li>Learning to code and building simple projects to practice my skills</li>
            <li>Using my free time to enjoy entertainment and relaxation</li>
          </ul>
        </div>
      </section>

      {/* 3. ORIGINAL PREVIEWS SECTION */}
      <section className="previews">
        <div className="container">
          <div className="preview-box">
            <h3>About Me</h3>
            <p>Find out more about my background, my interests, and what I enjoy doing in my free time.</p>
            <Link to="/about" className="btn">Learn More</Link>
          </div>

          <div className="preview-box">
            <h3>Get in Touch</h3>
            <p>Want to reach out? Head to the contact page to send me a message or find other ways to connect.</p>
            <Link to="/contact" className="btn">Contact Me</Link>
          </div>

          <div className="preview-box">
            <h3>Play a Game</h3>
            <p>Looking for a quick break? Try out the simple game I built as part of this project!</p>
            <Link to="/game" className="btn">Play Now</Link>
          </div>
        </div>
      </section>

      {/* 4. NEW PHASE 2 DYNAMIC BLOG POSTS SECTION (MOVED TO BOTTOM) */}
      <section className="about-content" style={{ backgroundColor: 'var(--bg-secondary)', padding: '60px 20px' }}>
        <div className="container">
          <h2>Latest Posts</h2>
          
          {loading ? (
            <p style={{ textAlign: 'center' }}>Loading posts...</p>
          ) : posts.length === 0 ? (
            <p style={{ textAlign: 'center' }}>No posts yet. Be the first to write one!</p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '35px', justifyContent: 'center' }}>
              {posts.map(post => (
                <div key={post._id} className="preview-box" style={{ margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  
                  <div>
                    {post.image && (
                      <img src={`http://localhost:5000/uploads/${post.image}`} alt={post.title} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '10px', marginBottom: '15px' }} />
                    )}
                    <h3 style={{ marginBottom: '10px', color: 'var(--text-accent)' }}>{post.title}</h3>
                    <p style={{ marginBottom: '15px' }}>{post.body.substring(0, 100)}...</p>
                  </div>
                  
                  <div>
                    <small style={{ display: 'block', marginBottom: '20px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                      By {post.author?.name} | {new Date(post.createdAt).toLocaleDateString()}
                    </small>
                    <Link to={`/posts/${post._id}`} className="btn">Read Post</Link>
                  </div>
                  
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default HomePage;