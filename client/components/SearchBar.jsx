import { useState } from 'react';
import { HiSearch, HiLocationMarker, HiFilter } from 'react-icons/hi';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ query, location, category });
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="bg-white p-2 rounded-2xl shadow-xl flex flex-col md:flex-row items-stretch gap-2 max-w-4xl mx-auto -mb-10 relative z-10"
    >
      <div className="flex-1 flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-gray-100">
        <HiSearch className="text-gray-400 w-5 h-5 mr-2" />
        <input
          type="text"
          placeholder="Search for barbers or salons..."
          className="w-full focus:outline-none text-gray-700 bg-transparent"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="flex-1 flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-gray-100">
        <HiLocationMarker className="text-gray-400 w-5 h-5 mr-2" />
        <select
          className="w-full focus:outline-none text-gray-700 bg-transparent appearance-none"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option value="">All Locations (Kenya)</option>
          <option value="Nairobi">Nairobi</option>
          <option value="Mombasa">Mombasa</option>
          <option value="Kisumu">Kisumu</option>
          <option value="Nakuru">Nakuru</option>
          <option value="Eldoret">Eldoret</option>
        </select>
      </div>

      <div className="flex-1 flex items-center px-4 py-2">
        <HiFilter className="text-gray-400 w-5 h-5 mr-2" />
        <select
          className="w-full focus:outline-none text-gray-700 bg-transparent appearance-none"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Barbershop">Barbershop</option>
          <option value="Salon">Salon</option>
          <option value="Spa">Spa & Wellness</option>
          <option value="Nails">Nail Studio</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95"
      >
        Search
      </button>
    </form>
  );
}
