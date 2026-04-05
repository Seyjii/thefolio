// src/App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'; 

// Phase 1 Pages
import SplashPage from './pages/SplashPage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import RegisterPage from './pages/RegisterPage';
import GamePage from './pages/GamePage';
import Navbar from './components/Navbar'; 

// Phase 2 Pages & Components
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';
import AdminPage from './pages/AdminPage';
import PostPage from './pages/PostPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Splash Page stands alone (No Nav/Footer) */}
      <Route path='/' element={<SplashPage />} />
      
      {/* All other pages get wrapped in the Layout */}
      <Route path='/*' element={
        <Navbar>
          <Routes>
            {/* Public Routes */}
            <Route path='/home' element={<HomePage />} />
            <Route path='/about' element={<AboutPage />} />
            <Route path='/contact' element={<ContactPage />} />
            <Route path='/game' element={<GamePage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/posts/:id' element={<PostPage />} />

            {/* Protected Routes (Logged In Users Only) */}
            <Route path='/profile' element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path='/create-post' element={<ProtectedRoute><CreatePostPage /></ProtectedRoute>} />
            <Route path='/edit-post/:id' element={<ProtectedRoute><EditPostPage /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path='/admin' element={<ProtectedRoute role='admin'><AdminPage /></ProtectedRoute>} />
          </Routes>
        </Navbar>
      } />
    </Routes>
  );
}

export default App;