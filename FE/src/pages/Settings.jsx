import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'

const API_URL = '/api/profile'

const THEME_OPTIONS = [
  { value: 'light', label: 'Sáng' },
  { value: 'dark', label: 'Tối' },
]

function Settings() {
  const { displayName, setDisplayName, theme, setTheme } = useApp()
  const [name, setName] = useState(displayName)
  const [prevDisplayName, setPrevDisplayName] = useState(displayName)
  const [password, setPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState({ type: '', text: '' })

  if (displayName !== prevDisplayName) {
    setPrevDisplayName(displayName)
    setName(displayName)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setNotice({ type: '', text: '' })
    try {
      const res = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          theme,
          password: password || undefined,
        }),
      })
      if (!res.ok) throw new Error('Lưu thất bại')
      const saved = await res.json()
      setDisplayName(saved.displayName)
      setTheme(saved.preferences.theme)
      setPassword('')
      setNotice({ type: 'success', text: 'Đã lưu cài đặt thành công' })
    } catch {
      setNotice({ type: 'error', text: 'Không thể lưu, vui lòng thử lại' })
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--text-h)] outline-none transition placeholder:text-[var(--text)] focus:border-[#111] focus:ring-2 focus:ring-black/10 theme-dark:focus:border-white theme-dark:focus:ring-white/10'

  const themeOptionClass =
    'flex cursor-pointer items-center justify-center rounded-lg border px-4 py-2.5 text-sm font-medium transition hover:border-[#111] theme-dark:hover:border-white'

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-[480px] rounded-xl border border-[var(--border)] bg-[var(--bg)] p-7 text-left shadow-[var(--shadow)]"
    >
      <h2 className="mb-1 text-[20px] font-semibold text-[var(--text-h)]">
        Cài đặt tài khoản
      </h2>
      <p className="mb-6 text-[13px] text-[var(--text)]">
        Cập nhật thông tin hiển thị và tùy chọn của bạn
      </p>

      <label className="mb-6 flex flex-col gap-1.5 text-[13px] font-medium text-[var(--text-h)]">
        Tên hiển thị
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tên của bạn"
          className={inputClass}
        />
      </label>

      <hr className="my-6 border-0 border-t border-[var(--border)]" />

      <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-[var(--text-h)]">
        Giao diện
      </h3>
      <div className="mb-6 grid grid-cols-2 gap-3">
        {THEME_OPTIONS.map(({ value, label }) => {
          const active = theme === value
          return (
            <label
              key={value}
              className={`${themeOptionClass} ${
                active
                  ? 'border-[#111] bg-[#111] text-white theme-dark:border-white theme-dark:bg-white theme-dark:text-[#111]'
                  : 'border-[var(--border)] bg-[var(--bg)] text-[var(--text)]'
              }`}
            >
              <input
                type="radio"
                name="theme"
                value={value}
                checked={active}
                onChange={() => setTheme(value)}
                className="sr-only"
              />
              {label}
            </label>
          )
        })}
      </div>

      <hr className="my-6 border-0 border-t border-[var(--border)]" />

      <label className="mb-6 flex flex-col gap-1.5 text-[13px] font-medium text-[var(--text-h)]">
        Mật khẩu vùng kín
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Đặt mật khẩu mới"
          autoComplete="new-password"
          className={inputClass}
        />
      </label>

      {notice.text && (
        <div
          role="status"
          className={`mb-6 rounded-lg border px-3.5 py-2.5 text-sm font-medium ${
            notice.type === 'success'
              ? 'border-green-500/40 bg-green-500/10 text-green-600'
              : 'border-red-500/40 bg-red-500/10 text-red-600'
          }`}
        >
          {notice.text}
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-lg bg-[#111] px-4 py-2.5 text-[15px] font-semibold text-white transition hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-60 theme-dark:bg-white theme-dark:text-[#111] theme-dark:hover:bg-[#e5e5e5]"
      >
        {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
      </button>
    </form>
  )
}

export default Settings