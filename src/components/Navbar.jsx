import { useState } from "react";
import { Link, NavLink } from "react-router";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <nav className="nav-wrap" aria-label="Main navigation">
        <Link to="/" className="brand" onClick={closeMenu} aria-label="RecipeFinder home">
          <span className="brand-icon" aria-hidden="true">✳</span>RecipeFinder
        </Link>
        <button className="menu-toggle" type="button" aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={menuOpen} aria-controls="main-links" onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 6 12 12M18 6 6 18" /></svg> : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M4 12h16M4 17h16" /></svg>}
        </button>
        <div id="main-links" className={`nav-links${menuOpen ? " is-open" : ""}`}>
          <NavLink to="/" end onClick={closeMenu}>Home</NavLink>
          <NavLink to="/#recipes" onClick={closeMenu}>Explore Recipes</NavLink>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
