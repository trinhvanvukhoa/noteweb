import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

function Settings() {
    const { setDisplayName, setTheme } = useAppContext();
    const [profile, setProfile] = useState({ displayName: '', theme: 'light', password: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5000/api/profile')
        .then(res => res.json())
        .then(data => {
            setProfile(data);
            setDisplayName(data.displayName);
            setTheme(data.theme);
            setLoading(false);
        })
        .catch(() => setLoading(false));
    }, []);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const [message, setMessage] = useState('');

    const handleSave = () => {
    fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
    })
        .then(res => res.json())
        .then(() => {
        setDisplayName(profile.displayName);
        setTheme(profile.theme);
        setMessage('Lưu thành công!');
        setTimeout(() => setMessage(''), 2000);
        })
        .catch(() => setMessage('Lỗi khi lưu, thử lại sau.'));
    };

    if (loading) return <p>Đang tải...</p>;

    return (
        <div>
        <h2>Cài đặt hệ thống</h2>
        <div style={{ marginBottom: '10px' }}>
            <label>Tên hiển thị: </label>
            <input name="displayName" value={profile.displayName} onChange={handleChange} />
        </div>
        <div style={{ marginBottom: '10px' }}>
            <label>Giao diện: </label>
            <select name="theme" value={profile.theme} onChange={handleChange}>
            <option value="light">Sáng</option>
            <option value="dark">Tối</option>
            </select>
        </div>
        <div style={{ marginBottom: '10px' }}>
            <label>Mật khẩu vùng kín: </label>
            <input type="password" name="password" value={profile.password} onChange={handleChange} />
        </div>
        <button onClick={handleSave}>Lưu thay đổi</button>
        </div>
    );
}

export default Settings;