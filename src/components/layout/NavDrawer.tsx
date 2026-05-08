import { NavLink } from 'react-router-dom';
import './NavDrawer.css';

export function NavDrawer() {
  return (
    <nav className="mainDrawer hide">
      <div className="mainDrawer-scrollContainer scrollContainer">
        <ul className="navList">
          <li>
            <NavLink to="/home" className="navItem">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/movies" className="navItem">
              Movies
            </NavLink>
          </li>
          <li>
            <NavLink to="/tv" className="navItem">
              TV
            </NavLink>
          </li>
          <li>
            <NavLink to="/music" className="navItem">
              Music
            </NavLink>
          </li>
          <li>
            <NavLink to="/livetv" className="navItem">
              Live TV
            </NavLink>
          </li>
          <li>
            <NavLink to="/search" className="navItem">
              Search
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
