import React from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(40,53,147,0.12)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <div style={{ position: 'relative', minWidth: 340 }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', fontSize: 22, color: '#283593', cursor: 'pointer', zIndex: 1 }}>×</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
