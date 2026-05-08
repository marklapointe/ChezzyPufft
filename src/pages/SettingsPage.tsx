import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '../components/ui';
import { useAuthStore } from '../store/authStore';
import { getConfig } from '../config';

export function SettingsPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);

  const config = getConfig();
  const [serverUrl, setServerUrl] = useState(config.getApiUrl());
  const [clientId, setClientId] = useState('');

  const handleSave = () => {
    config.setApiUrl(serverUrl);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

      <div className="space-y-6">
        <section className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Server Connection</h2>
          <div className="space-y-4">
            <Input
              label="Emby Server URL"
              type="text"
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              placeholder="http://localhost:8096"
            />
            <Input
              label="Client ID"
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="Generated automatically"
            />
            <Button onClick={handleSave}>Save Settings</Button>
          </div>
        </section>

        <section className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Account</h2>
          <Button variant="danger" onClick={handleLogout}>
            Sign Out
          </Button>
        </section>
      </div>
    </div>
  );
}
