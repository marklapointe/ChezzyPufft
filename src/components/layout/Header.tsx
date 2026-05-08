import { useAuthStore } from '../../store/authStore';
import './Header.css';

export function Header() {
  const { user, logout } = useAuthStore();

  return (
    <header className="skinHeader">
      <div className="headerTitle">
        <h1>Emby</h1>
      </div>
      {user && (
        <div className="headerUser">
          <span className="userName">{user.Name}</span>
          <button onClick={logout} className="logoutButton">
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
