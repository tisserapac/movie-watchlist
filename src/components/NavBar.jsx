import { NavLink } from 'react-router';
import './NavBar.css';

// NavLink adds the class "active" to the link of the current page.
function NavBar() {
  return (
    <nav className="nav-bar" aria-label="Main">
      <NavLink to="/" end className="nav-bar__link">
        Watchlist
      </NavLink>
      <NavLink to="/stats" className="nav-bar__link">
        Stats
      </NavLink>
    </nav>
  );
}

export default NavBar;
