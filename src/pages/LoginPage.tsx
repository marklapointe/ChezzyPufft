import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getApiClient } from '../api/client';
import type { User } from '../api/types';
import './LoginPage.css';

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [users] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleManualLogin = async (userId: string) => {
    setLoading(true);
    setError('');

    try {
      const client = getApiClient();
      const serverUrl = localStorage.getItem('emby-server-url') || 'http://localhost:8096';
      const accessToken = localStorage.getItem('emby-access-token') || '';

      client.setServerInfo(serverUrl, accessToken);
      const user = await client.getUser(userId);

      login(user, accessToken, serverUrl);
      navigate('/home');
    } catch (err) {
      setError(t('login.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginPage">
      <div className="loginContainer">
        <h1 className="loginTitle">{t('appName')}</h1>
        <p className="loginSubtitle">{t('login.selectUser')}</p>

        {error && <div className="loginError">{error}</div>}

        <div className="userGrid">
          {users.map((user) => (
            <button
              key={user.Id}
              className="userCard"
              onClick={() => handleManualLogin(user.Id)}
              disabled={loading}
            >
              <div className="userAvatar">
                {user.Name.charAt(0).toUpperCase()}
              </div>
              <span className="userCardName">{user.Name}</span>
            </button>
          ))}
        </div>

        <button
          className="manualLoginButton"
          onClick={() => handleManualLogin('manual')}
          disabled={loading}
        >
          {t('login.manualLogin')}
        </button>
      </div>
    </div>
  );
}
