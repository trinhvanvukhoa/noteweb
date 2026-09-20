import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

function Layout() {
  const { displayName, theme } = useAppContext();
  const isDark = theme === 'dark';

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: isDark ? '#111827' : '#ffffff',
        color: isDark ? '#ffffff' : '#111827',
        transition: 'all 0.2s ease',
      }}
    >
      <div
        style={{
          width: '200px',
          padding: '20px',
          borderRight: '1px solid',
          borderColor: isDark ? '#374151' : '#d1d5db',
          backgroundColor: isDark ? '#1f2937' : '#f8fafc',
          color: isDark ? '#ffffff' : '#111827',
        }}
      >
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