import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-[#f08809] p-4 shadow-md">
      <ul className="flex space-x-4 justify-center">
        <li><Link to="/" className="text-white hover:text-gray-200">Home</Link></li>
        <li><Link to="/login" className="text-white hover:text-gray-200">Login</Link></li>
        <li><Link to="/signup" className="text-white hover:text-gray-200">Signup</Link></li>
        <li><Link to="/search" className="text-white hover:text-gray-200">Search</Link></li>
        <li><Link to="/collection" className="text-white hover:text-gray-200">Collection</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
