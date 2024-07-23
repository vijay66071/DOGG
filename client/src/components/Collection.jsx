import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Collection = () => {
  const [collections, setCollections] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/collection');
        setCollections(res.data);
      } catch (error) {
        console.error('Error fetching collections', error);
        setError('Failed to fetch collections. Please try again.');
      }
    };
    fetchCollections();
  }, []);

  const handleRemoveImage = async (collectionId, imageCode) => {
    try {
      const updatedCollections = collections.map(collection => {
        if (collection._id === collectionId) {
          return {
            ...collection,
            images: collection.images.filter(img => img.code !== imageCode)
          };
        }
        return collection;
      });
      setCollections(updatedCollections);

      await axios.put(`http://localhost:3000/api/collection/${collectionId}`, {
        images: updatedCollections.find(c => c._id === collectionId).images
      });
    } catch (error) {
      console.error('Error removing image', error);
      setError('Failed to remove image. Please try again.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Saved Collections</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="space-y-8">
        {collections.map(collection => (
          <div key={collection._id} className="p-4 border border-gray-300 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">{collection.name}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {collection.images.map(img => (
                <div key={img.code} className="relative bg-white p-2 border border-gray-200 rounded-lg">
                  <img src={img.url} alt={`Response code ${img.code}`} className="w-full h-auto mb-2" />
                  <button
                    onClick={() => handleRemoveImage(collection._id, img.code)}
                    className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collection;
