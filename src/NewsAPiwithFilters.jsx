import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faEye, faCirclePlus, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

export const NewsApiWithLoadMore = () => {
  const [apiData, setApiData] = useState([]);
  const [zone, setZone] = useState("India"); // Default zone set to India
  const [searchQuery, setSearchQuery] = useState(""); // For custom search queries
  const [articlesToShow, setArticlesToShow] = useState(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Track errors
  const [darkMode, setDarkMode] = useState(
    document.documentElement.hasAttribute('data-theme') && 
    document.documentElement.getAttribute('data-theme') === 'dark'
  );
const backendUrl = import.meta.env.VITE_BACKEND_URL;
  

  // Function to fetch news based on a query or category
  const fetchNews = async (query) => {
    if (!query) {
      setError("Please enter a valid query.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}?q=${encodeURIComponent(query)}`);


      if (!response.ok) {
        throw new Error("Failed to fetch data from the API.");
      }

      const data = await response.json();

      if (data.status !== "ok") {
        throw new Error(data.message || "API returned an error.");
      }

      setLoading(false);
      setApiData(data.articles || []);
      setError(""); // Reset error if data is fetched successfully
    } catch (error) {
      setLoading(false);
      setError(error.message || "An unknown error occurred.");
      console.error("Error fetching news:", error);
    }
  };

  // Handle category filter click (update zone and fetch news)
  const handleFilterClick = (newZone) => {
    setZone(newZone); // Update zone to selected category
    setArticlesToShow(20); // Reset articles to show
    fetchNews(newZone); // Fetch news based on selected category
  };

  // Handle search form submission
  const searchNewsHandler = (e) => {
    e.preventDefault();
    fetchNews(searchQuery);
    setArticlesToShow(20); // Reset to show the first 20 articles
  };

  // Load more articles on button click
  const loadMoreHandler = () => {
    setArticlesToShow((prev) => prev + 20);
  };

  // Toggle dark mode
 

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [darkMode]);

  useEffect(() => {
    // Fetch news based on the selected zone when it changes
    if (!searchQuery) {
      fetchNews(zone);
    }
  }, [zone, searchQuery]);

  return (
    <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 font-sans transition-colors duration-300`}>
      {/* Header */}
     <header className="bg-white dark:bg-gray-800 dark:text-white shadow py-6">
  <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
    
    {/* Logo */}
    <h1 className="text-3xl font-bold text-indigo-700">📰 TheNews</h1>
    
    {/* Search Box */}
    <form onSubmit={searchNewsHandler} className="flex w-full sm:w-auto gap-2">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search news (e.g., Football, Economy)"
        className="w-full sm:w-72 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
      />
      <button
        type="submit"
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition"
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </button>
    </form>
    
    {/* Dark Mode Toggle */}
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
    >
      {darkMode ? <FontAwesomeIcon icon={faSun} size="lg" /> : <FontAwesomeIcon icon={faMoon} size="lg" /> }
    </button>

  </div>
</header>

      {/* Filter Buttons */}
      <div className="max-w-6xl mx-auto px-4 py-4 flex gap-4 flex-wrap justify-center">
        {[
          "India",
          "Sports",
          "Business",
          "Technology",
          "Health",
          "Science",
          "Entertainment",
          "Politics",
          "Finance",
          "Cryptocurrency",
          "Lifestyle",
          "Art",
          "Education",
          "Environment",
        ].map((filter) => (
          <button
            key={filter}
            onClick={() => handleFilterClick(filter)}
            className={`px-4 py-2 rounded-md font-semibold text-white ${
              zone === filter ? "bg-indigo-600" : "bg-indigo-400"
            } hover:bg-indigo-500`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-6xl mx-auto px-4 py-4 text-center text-red-600">
          {error}
        </div>
      )}

      {/* News Cards */}
      <main className="max-w-6xl mx-auto px-4 py-10">
        {loading ? (
          <div className="text-center text-xl text-gray-700 dark:text-gray-300">Loading news...</div>
        ) : (
          <>
            {apiData.length === 0 && !loading && !error ? (
              <div className="text-center text-xl text-gray-700 dark:text-gray-300">No articles found.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {apiData.slice(0, articlesToShow).map((article, index) =>
                  article.urlToImage ? (
                    <div
                      key={article.url || index}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition duration-300 flex flex-col overflow-hidden"
                    >
                      <img
                        src={article.urlToImage}
                        alt={article.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-5 flex-1 flex flex-col">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">{article.title}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          Published by {article.source?.name || "Unknown Source"}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 text-sm flex-grow">{article.description}</p>
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          <FontAwesomeIcon icon={faEye} />
                          Read More
                        </a>
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            )}

            {/* Load More */}
            {articlesToShow < apiData.length && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={loadMoreHandler}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full shadow-md text-lg transition"
                >
                  <FontAwesomeIcon icon={faCirclePlus} className="mr-2" />
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};
