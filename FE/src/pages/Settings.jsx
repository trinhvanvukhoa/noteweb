import { useState, useEffect } from 'react';
import { useAppContext } from '../context/useAppContext';

const inputClass =
  'rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition focus:border-honey dark:border-gray-600 dark:bg-gray-900 dark:text-white';

function Settings() {
    const { setDisplayName, setTheme } = useAppContext();
    const [profile, setProfile] = useState({ displayName: '', theme: 'light', password: '' });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('http://localhost:3000/api/profile')
        .then(res => res.json())
        .then(data => {
            setProfile(data);
            setDisplayName(data.displayName);
            setTheme(data.theme || 'light');
            setLoading(false);
        })
        .catch(() => setLoading(false));
    }, [setDisplayName, setTheme]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const nextProfile = { ...profile, [name]: value };
        setProfile(nextProfile);

        if (name === 'theme') {
            setTheme(value);
        }
    };

    const handleSave = () => {
        fetch('http://localhost:3000/api/profile', {
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

    if (loading) return <p className="text-gray-500">Đang tải...</p>;

    return (
        <div className="max-w-lg">
            <h2 className="mb-4 text-xl font-semibold sm:mb-5 sm:text-2xl">Cài đặt hệ thống</h2>

            <div className="mb-4">
                <label className="mb-1 block text-sm font-medium">Tên hiển thị</label>
                <input
                    name="displayName"
                    value={profile.displayName}
                    onChange={handleChange}
                    className={`${inputClass} w-full`}
                />
            </div>

            <div className="mb-4">
                <span className="mb-1 block text-sm font-medium">Giao diện</span>
                <div className="flex gap-6">
                    <label className="flex cursor-pointer items-center gap-2 text-sm">
                        <input
                            type="radio"
                            name="theme"
                            value="light"
                            checked={profile.theme === 'light'}
                            onChange={handleChange}
                            className="accent-honey"
                        />
                        Sáng
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 text-sm">
                        <input
                            type="radio"
                            name="theme"
                            value="dark"
                            checked={profile.theme === 'dark'}
                            onChange={handleChange}
                            className="accent-honey"
                        />
                        Tối
                    </label>
                </div>
            </div>

            <div className="mb-4">
                <label className="mb-1 block text-sm font-medium">Mật khẩu vùng kín</label>
                <input
                    type="password"
                    name="password"
                    value={profile.password}
                    onChange={handleChange}
                    className={`${inputClass} w-full`}
                />
            </div>

            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
                <button
                    onClick={handleSave}
                    className="rounded-md bg-honey px-4 py-2 text-sm font-medium text-gray-900 transition hover:bg-honey-dark"
                >
                    Lưu thay đổi
                </button>
                {message && <span className="text-sm">{message}</span>}
            </div>
        </div>
    );
}

export default Settings;
