import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './PageTransition.css';

function PageTransition({ children }) {
  const location = useLocation();

  useEffect(() => {
    // Trigger page transition animation
    const pageContent = document.querySelector('.page-content');
    if (pageContent) {
      pageContent.classList.remove('page-enter', 'page-exit');
      void pageContent.offsetWidth; // Force reflow
      pageContent.classList.add('page-enter');
    }
  }, [location.pathname]);

  return (
    <div className="page-transition-wrapper">
      <div className="page-content">
        {children}
      </div>
    </div>
  );
}

export default PageTransition;

