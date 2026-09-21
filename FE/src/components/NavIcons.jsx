const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export function HomeIcon({ className = 'h-6 w-6' }) {
  return (
    <svg className={className} {...base}>
      <path d="M3 11 12 3l9 8" />
      <path d="M5 10v10h14V10" />
    </svg>
  );
}

export function StatsIcon({ className = 'h-6 w-6' }) {
  return (
    <svg className={className} {...base}>
      <path d="M4 20V4" />
      <path d="M4 20h16" />
      <path d="M8 20v-6" />
      <path d="M13 20V9" />
      <path d="M18 20v-9" />
    </svg>
  );
}

export function SettingsIcon({ className = 'h-6 w-6' }) {
  return (
    <svg className={className} {...base}>
      <path d="M4 7h16" />
      <circle cx="9" cy="7" r="2.5" />
      <path d="M4 17h16" />
      <circle cx="15" cy="17" r="2.5" />
    </svg>
  );
}

export function LockIcon({ className = 'h-6 w-6' }) {
  return (
    <svg className={className} {...base}>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
