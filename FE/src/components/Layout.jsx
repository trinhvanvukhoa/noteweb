import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

function Layout() {
  const { displayName, theme } = useAppContext();

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
        color: theme === 'dark' ? '#ffffff' : '#000000',
      }}>
        
      <div style={{ width: '200px', padding: '20px', borderRight: '1px solid #ccc' }}>
        <h3>{displayName || 'Xin chào'}</h3>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link to="/" style={{ color: 'inherit' }}>Trang chủ</Link>
          <Link to="/settings" style={{ color: 'inherit' }}>Cài đặt</Link>
          <Link to="/private" style={{ color: 'inherit' }}>Vùng kín</Link>
        </nav>
      </div>

      <div style={{ flex: 1, padding: '20px' }}>
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;