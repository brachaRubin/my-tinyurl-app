import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { User } from '../../context/AuthContext';

type LoginResponse = {
  token: string;
  data: {
    user: User;
  };
};

interface LoginProps {
  onSuccess?: () => void;
}

export default function Login({ onSuccess }: LoginProps) {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post<LoginResponse>('http://localhost:3000/api/auth/login', form);
      login(res.data.token, res.data.data.user);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: 32, borderRadius: 10, boxShadow: '0 2px 16px rgba(40,53,147,0.08)', minWidth: 340, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <h2 style={{ textAlign: 'center', color: '#283593', marginBottom: 8 }}>Login</h2>
        <div style={{ display: 'flex', alignItems: 'center', background: '#f5f6fa', borderRadius: 6, padding: '8px 12px' }}>
          <span style={{ marginRight: 8, color: '#283593' }}>
            <i className="fa fa-envelope" />
          </span>
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
            style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1 }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', background: '#f5f6fa', borderRadius: 6, padding: '8px 12px' }}>
          <span style={{ marginRight: 8, color: '#283593' }}>
            <i className="fa fa-lock" />
          </span>
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1 }}
          />
        </div>
        <button type="submit" style={{ background: '#283593', color: 'white', border: 'none', borderRadius: 6, padding: '10px 0', fontWeight: 600, fontSize: 16, marginTop: 8, cursor: 'pointer' }}>Login</button>
        {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
      </form>
    </div>
  );
}