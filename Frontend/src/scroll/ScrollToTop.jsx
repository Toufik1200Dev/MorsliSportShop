import { useState, useEffect } from 'react';
import { KeyboardArrowUp } from "@mui/icons-material";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 bg-primary hover:bg-primary-dark text-black rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
      aria-label="Scroll to top"
    >
      <KeyboardArrowUp className="text-2xl" />
    </button>
  );
}
