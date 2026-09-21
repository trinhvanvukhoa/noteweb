import { useState, useEffect } from 'react';

const request = (url, options) =>
  fetch(url, options).then((res) => {
    if (!res.ok) throw new Error('Yêu cầu thất bại');
    return res.json();
  });

const inputClass =
  'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition focus:border-honey dark:border-gray-600 dark:bg-gray-900 dark:text-white';

function NoteBoard({ baseUrl, accent = 'bg-honey hover:bg-honey-dark' }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [viewingId, setViewingId] = useState(null);
  const [message, setMessage] = useState('');

  const isViewing = viewingId !== null;

  useEffect(() => {
    let ignore = false;

    const loadNotes = async () => {
      try {
        const data = await request(baseUrl);
        if (!ignore) setNotes(Array.isArray(data) ? data : []);
      } catch {
        if (!ignore) setNotes([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadNotes();

    return () => {
      ignore = true;
    };
  }, [baseUrl, reloadKey]);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setEditingId(null);
    setViewingId(null);
  };

  const handleSave = () => {
    if (!title.trim()) {
      setMessage('Vui lòng nhập tiêu đề.');
      return;
    }

    const isEditing = editingId !== null;
    const url = isEditing ? `${baseUrl}/${editingId}` : baseUrl;

    request(url, {
      method: isEditing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    })
      .then(() => {
        setMessage(isEditing ? 'Cập nhật thành công!' : 'Lưu thành công!');
        setTimeout(() => setMessage(''), 2000);
        resetForm();
        setReloadKey((key) => key + 1);
      })
      .catch(() => setMessage('Lỗi khi lưu, thử lại sau.'));
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note.id);
    setViewingId(null);
  };

  const handleView = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(null);
    setViewingId(note.id);
  };

  const handleDelete = (noteId) => {
    if (!window.confirm('Bạn có chắc muốn xóa không?')) return;

    request(`${baseUrl}/${noteId}`, { method: 'DELETE' })
      .then(() => {
        setMessage('Xóa thành công!');
        setTimeout(() => setMessage(''), 2000);
        if (editingId === noteId || viewingId === noteId) resetForm();
        setReloadKey((key) => key + 1);
      })
      .catch(() => setMessage('Lỗi khi xóa, thử lại sau.'));
  };

  return (
    <div>
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-3 text-lg font-semibold">
          {isViewing ? 'Xem ghi chú' : editingId !== null ? 'Sửa ghi chú' : 'Thêm ghi chú mới'}
        </h3>
        <input
          placeholder="Tiêu đề"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          readOnly={isViewing}
          className={`${inputClass} mb-3`}
        />
        <textarea
          placeholder="Nội dung"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          readOnly={isViewing}
          rows={4}
          className={`${inputClass} mb-3 resize-y`}
        />
        <div className="flex flex-wrap items-center gap-2">
          {!isViewing && (
            <button
              onClick={handleSave}
              className={`w-full rounded-md px-4 py-2.5 text-sm font-medium text-gray-900 transition sm:w-auto sm:py-2 ${accent}`}
            >
              Lưu
            </button>
          )}
          {(editingId !== null || isViewing) && (
            <button
              onClick={resetForm}
              className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm text-gray-700 transition hover:bg-honey/15 sm:w-auto sm:py-2 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              {isViewing ? 'Đóng' : 'Hủy'}
            </button>
          )}
          {isViewing && (
            <button
              onClick={() => handleDelete(viewingId)}
              className="w-full rounded-md border border-red-300 px-4 py-2.5 text-sm text-red-600 transition hover:bg-red-50 sm:w-auto sm:py-2 dark:border-red-500 dark:text-red-400 dark:hover:bg-red-500/10"
            >
              Xóa
            </button>
          )}
          {message && <span className="text-sm">{message}</span>}
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Đang tải...</p>
      ) : notes.length === 0 ? (
        <p className="text-gray-500">Chưa có ghi chú nào.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
          {notes.map((note) => (
            <div
              key={note.id}
              className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <h4 className="font-semibold">{note.title}</h4>
                <div className="flex gap-1">
                  <button
                    title="Xem"
                    onClick={() => handleView(note)}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded transition hover:bg-honey/15 sm:h-8 sm:w-8 dark:hover:bg-gray-700"
                  >
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                  <button
                    title="Sửa"
                    onClick={() => handleEdit(note)}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded transition hover:bg-honey/15 sm:h-8 sm:w-8 dark:hover:bg-gray-700"
                  >
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                    </svg>
                  </button>
                </div>
              </div>
              <p className="whitespace-pre-wrap text-sm">{note.content}</p>
              <small className="mt-2 block text-xs text-gray-500">
                {new Date(note.createdAt).toLocaleString('vi-VN')}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NoteBoard;
