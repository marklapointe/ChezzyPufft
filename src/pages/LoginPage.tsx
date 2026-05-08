import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '../components/ui';
import { useAuthStore } from '../store/authStore';
import { getConfig } from '../config';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, loginStart, loginError, isAuthenticated, error, isLoading } = useAuthStore();
  const [serverUrl, setServerUrl] = useState(getConfig().getApiUrl());
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  if (isAuthenticated) {
    navigate('/', { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    loginStart();
    try {
      const response = await fetch(`${serverUrl}/Users/AuthenticateByName`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Username: username, Password: password })
      });
      if (!response.ok) {
        loginError('Invalid username or password');
        return;
      }
      const data = await response.json();
      login(data.User, data.AccessToken, serverUrl);
      navigate('/', { replace: true });
    } catch (err) {
      loginError('Connection failed. Please check server URL.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg">
        <h1 className="text-2xl font-bold text-white text-center mb-8">
          Sign in to Emby
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Server URL"
            type="text"
            value={serverUrl}
            onChange={(e) => setServerUrl(e.target.value)}
            placeholder="http://localhost:8096"
            required
          />

          <Input
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <Button type="submit" fullWidth loading={isLoading}>
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
