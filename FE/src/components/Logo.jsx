function Logo({ className = 'h-8 w-8' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="NoteWeb"
    >
      <rect x="3" y="3" width="26" height="26" rx="7" fill="#f5b301" />
      <rect x="9" y="11" width="14" height="2.5" rx="1.25" fill="#ffffff" />
      <rect x="9" y="16" width="14" height="2.5" rx="1.25" fill="#ffffff" />
      <rect x="9" y="21" width="9" height="2.5" rx="1.25" fill="#ffffff" />
      <circle cx="23.5" cy="9" r="2.5" fill="#d99a00" />
    </svg>
  );
}

export default Logo;
