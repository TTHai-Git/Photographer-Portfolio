import React from 'react';
import '../Assets/CSS/Footer.css';
import { FaFacebookF, FaInstagram, FaArrowUp, FaBehance } from 'react-icons/fa';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className='footer'>
      <div className='footer-content'>
        <div className='footer-left'>
          <p>📞 Phone: 079 8207 241</p>
          <p>📧 Email: hoangtruc7499@gmail.com</p>
        </div>

        <div className='footer-right'>
          <a
            href='https://www.facebook.com/trucpham7499#'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Facebook'
          >
            <FaFacebookF className='social-icon' />
          </a>
          <a
            href='https://www.instagram.com/trucluvyelou/'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Instagram'
          >
            <FaInstagram className='social-icon' />
          </a>
          <a
            href='https://www.behance.net/trucpham3'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Behance'
          >
            <FaBehance className='social-icon' />
          </a>
        </div>
      </div>

      <div className='footer-bottom'>
        <p>© 2025 Hoang Truc Photography Portfolio Website. All rights reserved.</p>
      </div>

      <button className='back-to-top' onClick={scrollToTop} aria-label='Back to top'>
        <FaArrowUp />
      </button>
    </footer>
  );
};

export default Footer;
