import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaSignOutAlt, FaUser, FaSignInAlt, FaLink } from 'react-icons/fa';

interface HeaderProps {
  onLogout: () => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout, onLoginClick, onRegisterClick }) => {
  const { user } = useContext(AuthContext);

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', zIndex: 1002,
      background: '#283593', color: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ width: '100%', maxWidth: 1200, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: 22 }}>
        <FaLink style={{ marginRight: 10, fontSize: 28 }} /> TinyURL Dashboard
      </div>
      <div>
        {user ? (
          <button onClick={onLogout} style={{ background: 'none', border: 'none', color: 'white', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <FaSignOutAlt style={{ marginRight: 6 }} /> Logout
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            <button
              onClick={onRegisterClick}
              style={{ background: 'none', border: 'none', color: 'white', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0 14px 0 0' }}
            >
              <FaUser style={{ marginRight: 6 }} /> Register
            </button>
            <span style={{ height: 22, width: 1.5, background: '#e3e7f7', margin: '0 6px', display: 'inline-block', borderRadius: 2 }}></span>
            <button
              onClick={onLoginClick}
              style={{ background: 'none', border: 'none', color: 'white', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0 0 0 14px' }}
            >
              <FaSignInAlt style={{ marginRight: 6 }} /> Login
            </button>
          </div>
        )}
      </div>
      </div>
    </header>
  );
};

export default Header;
