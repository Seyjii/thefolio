import { useState, useEffect } from 'react';
import API from '../api/axios';

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [tab, setTab] = useState('users');

  useEffect(() => {
    API.get('/admin/users').then(r => setUsers(r.data));
    API.get('/admin/posts').then(r => setPosts(r.data));
  }, []);

  const toggleStatus = async (id) => {
    const { data } = await API.put(`/admin/users/${id}/status`);
    setUsers(users.map(u => u._id === id ? data.user : u));
  };

  const removePost = async (id) => {
    await API.put(`/admin/posts/${id}/remove`);
    setPosts(posts.map(p => p._id === id ? { ...p, status: 'removed' } : p));
  };

  return (
    <section className="contact-content">
      <div className="container">
        <h2>Admin Dashboard</h2>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '40px' }}>
          <button onClick={() => setTab('users')} className="btn" style={{ opacity: tab === 'users' ? 1 : 0.5 }}>
            Members ({users.length})
          </button>
          <button onClick={() => setTab('posts')} className="btn" style={{ opacity: tab === 'posts' ? 1 : 0.5 }}>
            Posts ({posts.length})
          </button>
        </div>

        {tab === 'users' && (
          <div className="resources">
            <h3>Member Directory</h3>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead><tr><th>Name</th><th>Email</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td style={{ color: u.status === 'active' ? '#4CAF50' : '#ff4d4d', fontWeight: 'bold' }}>{u.status.toUpperCase()}</td>
                      <td>
                        <button onClick={() => toggleStatus(u._id)} className="btn" style={{ padding: '5px 10px', fontSize: '12px' }}>
                          {u.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'posts' && (
          <div className="resources">
            <h3>Content Moderation</h3>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead><tr><th>Title</th><th>Author</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {posts.map(p => (
                    <tr key={p._id}>
                      <td>{p.title}</td>
                      <td>{p.author?.name}</td>
                      <td style={{ color: p.status === 'published' ? '#4CAF50' : '#ff4d4d', fontWeight: 'bold' }}>{p.status.toUpperCase()}</td>
                      <td>
                        {p.status === 'published' && (
                          <button onClick={() => removePost(p._id)} className="btn" style={{ padding: '5px 10px', fontSize: '12px', background: '#ff4d4d' }}>
                            Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminPage;