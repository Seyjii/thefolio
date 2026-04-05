import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SplashPage() {
  const [dots, setDots] = useState('');
  const [isFadingOut, setIsFadingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Animated dots logic translated from your original script
    let dotCount = 0;
    const dotInterval = setInterval(() => {
      dotCount = (dotCount + 1) % 4;
      setDots('.'.repeat(dotCount));
    }, 600);

    // Redirect to home page logic translated from your original script
    const fadeTimeout = setTimeout(() => {
      setIsFadingOut(true);
      
      const redirectTimeout = setTimeout(() => {
        navigate('/home'); // Replaces window.location.href = 'home.html'
      }, 1200);

      // Cleanup inner timeout
      return () => clearTimeout(redirectTimeout);
    }, 3800);

    // Cleanup interval and outer timeout when component unmounts
    return () => {
      clearInterval(dotInterval);
      clearTimeout(fadeTimeout);
    };
  }, [navigate]);

  return (
    /* Note: Since React mounts inside a <body> tag automatically, 
      the original <body> tag is changed to a <div> wrapper here to prevent errors. 
    */
    <div id="body-overlay" className={isFadingOut ? 'fade-out-screen' : ''}>
      <div className="loader-container" id="loader">
        <div className="logo-wrapper">
          <svg className="aesthetic-controller" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 11.5C21 15.09 18.09 18 14.5 18H9.5C5.91 18 3 15.09 3 11.5C3 8.19 5.5 5.5 8.75 5.5H15.25C18.5 5.5 21 8.19 21 11.5Z" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M6 12H8M7 11V13M15 11.5H15.01M18 11.5H18.01M16.5 13H16.51" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h1>Sijey's World</h1>
        
        <div className="progress-wrapper">
          <div className="progress-bar"></div>
        </div>
        
        <div className="loading-subtitle">
          Portfolio Loading<span id="dots">{dots}</span>
        </div>
      </div>
    </div>
  );
}

export default SplashPage;