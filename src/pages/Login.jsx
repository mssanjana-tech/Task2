import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

export default function Login() {
  const [activeTab, setActiveTab] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setUsername('');
    setError('');
    setSuccess('');
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    resetForm();
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: signInError } = await signIn(email, password);
    if (signInError) {
      setError(signInError.message);
    } else {
      navigate('/chat');
    }
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!username.trim()) {
      setError('Please enter a username');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const { data, error: signUpError } = await signUp(email, password, username.trim());
    if (signUpError) {
      setError(signUpError.message);
    } else if (data?.user?.identities?.length === 0) {
      setError('An account with this email already exists');
    } else {
      setSuccess(
        'Account created! Please check your email to confirm your account before signing in.'
      );
      setEmail('');
      setPassword('');
      setUsername('');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-theme-toggle">
        <ThemeToggle />
      </div>

      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">💬</div>
          <h1 className="auth-title">
            <span className="gradient-text">ChatFlow</span>
          </h1>
          <p className="auth-subtitle">
            Real-time conversations, beautifully simple
          </p>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${activeTab === 'signin' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('signin')}
            id="signin-tab"
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('signup')}
            id="signup-tab"
          >
            Sign Up
          </button>
        </div>

        {error && <div className="toast toast-error">{error}</div>}
        {success && <div className="toast toast-success">{success}</div>}

        {activeTab === 'signin' ? (
          <form className="auth-form" onSubmit={handleSignIn} id="signin-form">
            <div className="form-group">
              <label className="form-label" htmlFor="signin-email">
                Email
              </label>
              <input
                id="signin-email"
                className="form-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="signin-password">
                Password
              </label>
              <input
                id="signin-password"
                className="form-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
              id="signin-submit"
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleSignUp} id="signup-form">
            <div className="form-group">
              <label className="form-label" htmlFor="signup-username">
                Username
              </label>
              <input
                id="signup-username"
                className="form-input"
                type="text"
                placeholder="johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="signup-email">
                Email
              </label>
              <input
                id="signup-email"
                className="form-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="signup-password">
                Password
              </label>
              <input
                id="signup-password"
                className="form-input"
                type="password"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
              id="signup-submit"
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        )}

        <div className="auth-footer">
          {activeTab === 'signin'
            ? "Don't have an account? Click Sign Up above"
            : 'Already have an account? Click Sign In above'}
        </div>
      </div>
    </div>
  );
}
