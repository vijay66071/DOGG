import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if the user is authenticated
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);

    // Fetch images
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const codes = ['200', '404', '500']; // Example codes
      const promises = codes.map(code =>
        axios.get(`https://http.dog/${code}.jpg`).then(res => ({ code, url: res.config.url }))
      );
      const results = await Promise.all(promises);
      setImages(results);
    } catch (error) {
      console.error('Error fetching images:', error);
      setError('Failed to fetch images. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-custom-orange text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-lg font-bold">Home</Link>
          <div className="space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/search" className="hover:underline">Search</Link>
                <Link to="/collection" className="hover:underline">My Collection</Link>
                <button
                  className="hover:underline"
                  onClick={() => {
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:underline">Login</Link>
                <Link to="/signup" className="hover:underline">Signup</Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Welcome to the Dogg</h1>
        <p className="text-gray-600 mb-6">Searching for dog images based on response codes and manage your image collection.</p>

        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Featured Images</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.map(img => (
            <img
              key={img.code}
              src={img.url}
              alt={`Response code ${img.code}`}
              className="w-full h-48 object-cover rounded-lg shadow-md"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
