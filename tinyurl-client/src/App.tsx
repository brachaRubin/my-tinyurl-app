import React from 'react';
import { AuthProvider } from './context/AuthContext';
import AppContent from './components/AppContent';
import Header from './components/Header';
import Modal from './components/Modal';
import Login from './components/auth/Login';
import Register from './components/auth/Register';



export default function App() {
    // Modal state for login/register
    const [loginOpen, setLoginOpen] = React.useState(false);
    const [registerOpen, setRegisterOpen] = React.useState(false);

    // Logout logic: clear token and reload
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.reload();
    };

    return (
        <AuthProvider>
            <Header
                onLogout={handleLogout}
                onLoginClick={() => setLoginOpen(true)}
                onRegisterClick={() => setRegisterOpen(true)}
            />
            <div style={{ minHeight: '100vh', width: '100vw', background: 'linear-gradient(135deg, #e3e7f7 0%, #f5f6fa 100%)', paddingTop: 72 }}>
                <div style={{ margin: '0 auto', padding: '32px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <AppContent hideAuthForms={loginOpen || registerOpen} />
                </div>
            </div>
            <Modal open={loginOpen} onClose={() => setLoginOpen(false)}>
                <Login onSuccess={() => setLoginOpen(false)} />
            </Modal>
            <Modal open={registerOpen} onClose={() => setRegisterOpen(false)}>
                <Register onSuccess={() => setRegisterOpen(false)} />
            </Modal>
        </AuthProvider>
    );
}