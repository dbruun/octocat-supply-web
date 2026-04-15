import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const { darkMode } = useTheme();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const errorMsg = searchParams.get('error');
    if (errorMsg) {
      setError(errorMsg);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div
      className={`min-h-screen pt-20 ${darkMode ? 'bg-dark' : 'bg-gray-50'} flex items-center justify-center px-4 transition-colors duration-300`}
    >
      <div
        className={`max-w-md w-full ${darkMode ? 'bg-gray-800 border-gray-700' : 'ms-card'} rounded-xl p-8 border transition-colors duration-300`}
      >
        <h2
          className={`text-3xl font-semibold ${darkMode ? 'text-light' : 'text-gray-900'} mb-6 transition-colors duration-300`}
        >
          Login
        </h2>

        {error && (
          <div role="alert" className="bg-red-500/10 border border-red-500 text-red-600 rounded-md p-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className={`block ${darkMode ? 'text-light' : 'text-gray-700'} mb-2 transition-colors duration-300`}
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${darkMode ? 'ms-input-dark' : 'ms-input'}`}
              required
              autoFocus
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className={`block ${darkMode ? 'text-light' : 'text-gray-700'} mb-2 transition-colors duration-300`}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${darkMode ? 'ms-input-dark' : 'ms-input'}`}
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full ${darkMode ? 'ms-button-primary-dark' : 'ms-button-primary'}`}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
