import { useState } from 'react';
import NoteBoard from '../components/NoteBoard';

const API_URL = 'http://localhost:3000/api/private';

function PrivateNotes() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  const handleLogin = () => {
    fetch(`${API_URL}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: passwordInput }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setIsUnlocked(true);
        } else {
          alert('Sai mật khẩu');
          setPasswordInput('');
        }
      })
      .catch(() => alert('Sai mật khẩu'));
  };

  if (!isUnlocked) {
    return (
      <div className="mx-auto mt-12 flex max-w-sm flex-col items-center gap-3 rounded-lg border border-gray-200 bg-white p-6 text-center sm:mt-24 sm:p-8 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-cocoa">Khu vực Bảo mật</h2>
        <p className="text-sm text-gray-500">Vui lòng nhập mật khẩu để truy cập</p>
        <input
          type="password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          placeholder="Nhập mật khẩu..."
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition focus:border-honey dark:border-gray-600 dark:bg-gray-900 dark:text-white"
        />
        <button
          onClick={handleLogin}
          className="w-full rounded-md bg-honey px-4 py-2 text-sm font-medium text-gray-900 transition hover:bg-honey-dark"
        >
          Mở khóa
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold text-cocoa sm:mb-5 sm:text-2xl">Khu vực Ghi chú Riêng tư</h2>
      <NoteBoard baseUrl={`${API_URL}/notes`} />
    </div>
  );
}

export default PrivateNotes;
