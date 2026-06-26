import React from 'react';
import { Link } from 'react-router-dom';

export default function Nav() {
  return (
    <nav className="site-nav">
      <Link className="site-nav__link" to="/">Home</Link>
      <Link className="site-nav__link" to="/dashboard">Dashboard</Link>
      <Link className="site-nav__link" to="/features">Features</Link>
      <Link className="site-nav__link" to="/pricing">Pricing</Link>
    </nav>
  );
}
