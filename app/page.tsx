'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';

interface Business {
  name: string;
  phone: string;
  address: string;
  rating?: string;
  website?: string;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [service, setService] = useState<google.maps.places.PlacesService | null>(null);

  const initMap = () => {
    if (typeof window !== 'undefined' && (window as any).google) {
      const mapDiv = document.getElementById('map');
      if (mapDiv) {
        const newMap = new google.maps.Map(mapDiv, {
          center: { lat: 0, lng: 0 },
          zoom: 2,
        });
        setMap(newMap);
        setService(new google.maps.places.PlacesService(newMap));
      }
    }
  };

  const searchPlaces = () => {
    if (!service || !searchQuery) return;

    setLoading(true);
    setBusinesses([]);

    const request = {
      query: `${searchQuery} in ${location || 'worldwide'}`,
      fields: ['name', 'formatted_address', 'formatted_phone_number', 'rating', 'website'],
    };

    service.textSearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        const extractedData: Business[] = results.map((place: any) => ({
          name: place.name || 'N/A',
          phone: place.formatted_phone_number || 'N/A',
          address: place.formatted_address || 'N/A',
          rating: place.rating?.toString() || 'N/A',
          website: place.website || 'N/A',
        }));
        setBusinesses(extractedData);
      } else {
        alert('No results found or error occurred. Status: ' + status);
      }
      setLoading(false);
    });
  };

  const exportToExcel = () => {
    if (businesses.length === 0) {
      alert('No data to export');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(businesses);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Businesses');

    const fileName = `google_maps_data_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const addManualEntry = () => {
    const newBusiness: Business = {
      name: 'Sample Business ' + (businesses.length + 1),
      phone: '+1 555-' + Math.floor(Math.random() * 9000 + 1000),
      address: '123 Main St, City, State ' + Math.floor(Math.random() * 90000 + 10000),
      rating: (Math.random() * 2 + 3).toFixed(1),
      website: 'https://example.com',
    };
    setBusinesses([...businesses, newBusiness]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center">
            Google Maps Business Data Extractor
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Extract business information and export to Excel
          </p>

          {/* Google Maps API Notice */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Demo Mode:</strong> To use Google Maps API, you need an API key.
                  For now, you can add sample data manually or integrate your own Google Maps API key.
                </p>
              </div>
            </div>
          </div>

          {/* Search Section */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Query
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g., restaurants, hotels, dentists"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., New York, USA"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={initMap}
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              Initialize Google Maps
            </button>
            <button
              onClick={searchPlaces}
              disabled={loading || !service}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Searching...' : 'Search Places'}
            </button>
            <button
              onClick={addManualEntry}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
            >
              Add Sample Data
            </button>
            <button
              onClick={exportToExcel}
              disabled={businesses.length === 0}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              Export to Excel
            </button>
          </div>

          {/* Hidden Map Container */}
          <div id="map" style={{ display: 'none' }}></div>

          {/* Results Table */}
          {businesses.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Extracted Data ({businesses.length} results)
              </h2>
              <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Business Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Address
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Website
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {businesses.map((business, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {business.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {business.phone}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {business.address}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {business.rating}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                          {business.website !== 'N/A' ? (
                            <a href={business.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                              Link
                            </a>
                          ) : (
                            'N/A'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Instructions */}
          {businesses.length === 0 && (
            <div className="mt-8 bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">How to Use:</h3>
              <ol className="list-decimal list-inside space-y-2 text-blue-800">
                <li>Click "Add Sample Data" to add demo business entries</li>
                <li>Or integrate Google Maps API key in the HTML head section</li>
                <li>Enter your search query (e.g., "restaurants", "hotels")</li>
                <li>Specify a location (optional)</li>
                <li>Click "Search Places" to extract data</li>
                <li>Review the extracted business information</li>
                <li>Click "Export to Excel" to download the data</li>
              </ol>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-600">
          <p>© 2024 Google Maps Data Extractor | Built with Next.js & Excel Export</p>
        </div>
      </div>

      {/* Google Maps Script */}
      <script
        src={`https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY_HERE&libraries=places`}
        async
        defer
      ></script>
    </div>
  );
}
