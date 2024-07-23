import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Utility function to parse JWT token
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

const Search = () => {
  const [filter, setFilter] = useState(''); // Initially empty response code
  const [images, setImages] = useState([]); // Array of image URLs
  const [selectedImages, setSelectedImages] = useState([]); // Array of selected images
  const [listName, setListName] = useState(''); // Initially empty list name
  const [error, setError] = useState('');
  const [collections, setCollections] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      setError('User ID not found. Please login.');
    }
    fetchCollections();
  }, []);

  const fetchImages = async (codes) => {
    const promises = codes.map(async (code) => {
      try {
        const res = await axios.get(`https://http.dog/${code}.jpg`);
        return { code, url: res.config.url };
      } catch (error) {
        return { code, url: '/path/to/placeholder-image.jpg' }; // Placeholder or error image
      }
    });
    const results = await Promise.all(promises);
    return results;
  };

  const handleSearch = async () => {
    setError('');
    setImages([]);
    setSelectedImages([]);
    if (!filter) {
      setError('Please enter a response code to search.');
      return;
    }
    try {
      setSearchPerformed(true);
      let codes = [];

      if (filter.includes('x')) {
        const pattern = new RegExp(`^${filter.replace(/x/g, '\\d')}$`);
        for (let i = 100; i < 600; i++) {
          if (pattern.test(i.toString())) {
            codes.push(i.toString());
          }
        }
      } else {
        codes.push(filter);
      }

      const results = await fetchImages(codes);
      setImages(results);
    } catch (error) {
      console.error('Search API error:', error.message);
      setError('Failed to fetch images. Please try again.');
    }
  };

  const handleAddImage = (image) => {
    if (!selectedImages.some(img => img.code === image.code)) {
      setSelectedImages([...selectedImages, image]);
    }
  };

  const handleSaveCollection = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('User not authenticated');
      return;
    }

    const decodedToken = parseJwt(token);
    if (!decodedToken) {
      alert('Invalid token');
      return;
    }

    const userId = decodedToken.id;

    const newCollection = {
      name: listName,
      filter,
      images: selectedImages,
      userId
    };

    try {
      await axios.post('http://localhost:3000/api/collection', newCollection);
      setListName('');
      setImages([]);
      setSelectedImages([]);
      setFilter('');
      setSearchPerformed(false);
      alert('Collection saved successfully!');
      fetchCollections(); // Fetch the updated collections after saving
    } catch (error) {
      console.error('Error saving collection', error);
      setError('Failed to save collection. Please try again.');
    }
  };

  const fetchCollections = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/collection');
      setCollections(res.data);
    } catch (error) {
      console.error('Error fetching collections', error);
      setError('Failed to fetch collections. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">HTTP Dog Image Search</h2>
      <div className="mb-4">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Enter response code"
          className="border rounded-lg p-2 w-full md:w-1/2"
        />
      </div>
      <button
        onClick={handleSearch}
        className="bg-custom-orange text-white rounded-lg p-2 mb-4 bg-orange-700 hover:bg-orange-600 transition duration-300"
      >
        Search
      </button>
      <div className="image-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {images.map(img => (
          <div key={img.code} className="relative bg-white p-2 border border-gray-200 rounded-lg">
            <img
              src={img.url}
              alt={`Response code ${img.code}`}
              className="w-full h-48 object-cover rounded-lg shadow-md"
            />
            <button
              onClick={() => handleAddImage(img)}
              className="absolute bottom-2 right-2 bg-green-500 text-white px-2 py-1 rounded"
            >
              Add
            </button>
          </div>
        ))}
      </div>
      {selectedImages.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2">Selected Codes</h3>
          <div className="selected-images grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {selectedImages.map(img => (
              <div key={img.code} className="code-display p-2 border border-gray-200 rounded-lg text-center">
                {img.code}
              </div>
            ))}
          </div>
        </div>
      )}
      {searchPerformed && (
        <>
          <div className="mb-4">
            <input
              type="text"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder="Collection name"
              className="border rounded-lg p-2 w-full md:w-1/2"
            />
          </div>
          <button
            onClick={handleSaveCollection}
            className="bg-custom-orange text-white rounded-lg p-2 mb-4 bg-orange-700 hover:bg-orange-600 transition duration-300"
          >
            Save Collection
          </button>
        </>
      )}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <Link to="/collection" className="text-blue-500 hover:underline">View Saved Collections</Link>
    </div>
  );
};

export default Search;
