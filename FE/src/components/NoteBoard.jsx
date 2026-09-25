import { useState, useEffect, useMemo } from 'react';

const request = (url, options) =>
  fetch(url, options).then((res) => {
    if (!res.ok) throw new Error('Yêu cầu thất bại');
    return res.json();
  });

const inputClass =
  'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition focus:border-honey dark:border-gray-600 dark:bg-gray-900 dark:text-white';

const PAGE_SIZE = 8; // số ghi chú mỗi trang

function NoteBoard({ baseUrl, accent = 'bg-honey hover:bg-honey-dark' }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [viewingId, setViewingId] = useState(null);
  const [message, setMessage] = useState('');

  // ---- State mới: tìm kiếm, sắp xếp, phân trang ----
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // newest | oldest | title-asc | title-desc
  const [currentPage, setCurrentPage] = useState(1);

  // Lưu lại bộ lọc trước đó để phát hiện thay đổi ngay trong lúc render
  const [prevFilters, setPrevFilters] = useState({ searchTerm, sortBy, baseUrl });
  if (
    prevFilters.searchTerm !== searchTerm ||
    prevFilters.sortBy !== sortBy ||
    prevFilters.baseUrl !== baseUrl
  ) {
    setPrevFilters({ searchTerm, sortBy, baseUrl });
    setCurrentPage(1);
  }

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

  // ---- Lọc theo từ khóa (tiêu đề + nội dung, không phân biệt hoa thường) ----
  const filteredNotes = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return notes;
    return notes.filter(
      (note) =>
        note.title?.toLowerCase().includes(keyword) ||
        note.content?.toLowerCase().includes(keyword)
    );
  }, [notes, searchTerm]);

  // ---- Sắp xếp ----
  const sortedNotes = useMemo(() => {
    const list = [...filteredNotes];
    switch (sortBy) {
      case 'oldest':
        return list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'title-asc':
        return list.sort((a, b) => a.title.localeCompare(b.title, 'vi'));
      case 'title-desc':
        return list.sort((a, b) => b.title.localeCompare(a.title, 'vi'));
      case 'newest':
      default:
        return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  }, [filteredNotes, sortBy]);

  // ---- Phân trang ----
  const totalPages = Math.max(1, Math.ceil(sortedNotes.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedNotes = sortedNotes.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

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

      {/* ---- Thanh tìm kiếm + sắp xếp ---- */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Tìm theo tiêu đề hoặc nội dung..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`${inputClass} sm:max-w-xs`}
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={`${inputClass} sm:w-56`}
        >
          <option value="newest">Mới nhất</option>
          <option value="oldest">Cũ nhất</option>
          <option value="title-asc">Tiêu đề A → Z</option>
          <option value="title-desc">Tiêu đề Z → A</option>
        </select>
      </div>

      {loading ? (
        <p className="text-gray-500">Đang tải...</p>
      ) : sortedNotes.length === 0 ? (
        <p className="text-gray-500">
          {searchTerm ? 'Không tìm thấy ghi chú phù hợp.' : 'Chưa có ghi chú nào.'}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
            {paginatedNotes.map((note) => (
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

          {/* ---- Phân trang ---- */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm transition hover:bg-honey/15 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Trước
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-8 w-8 rounded-md text-sm transition ${
                    page === safePage
                      ? 'bg-honey font-medium text-gray-900'
                      : 'border border-gray-300 hover:bg-honey/15 dark:border-gray-600 dark:hover:bg-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm transition hover:bg-honey/15 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Sau
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default NoteBoard;