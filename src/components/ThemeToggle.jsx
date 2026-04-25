import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className={`theme-toggle ${className}`}
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      id="theme-toggle-btn"
    >
      <span className="theme-toggle-icon">
        {theme === 'light' ? '🌙' : '☀️'}
      </span>
    </button>
  );
}
