import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faEye, faCirclePlus } from "@fortawesome/free-solid-svg-icons";

export const NewsApiWithLoadMore = () => {
    const [apiData, setApiData] = useState([]);
    const [zone, setZone] = useState("india");
    const [articlesToShow, setArticlesToShow] = useState(20);
    const api_key = "dcada234e81447a29180b187c98ce73c";
    const today = new Date();
    const date = today.getDate();

    const fetchNews = async (query) => {
        const response = await fetch(
            `https://newsapi.org/v2/everything?q=${query}&from=${date}&sortBy=publishedAt&apiKey=${api_key}`
        );
        const data = await response.json();
        setApiData(data.articles);
    };

    useEffect(() => {
        fetchNews(zone);
    }, []);

    const searchNewsHandler = async (event) => {
        event.preventDefault();
        fetchNews(zone);
        setArticlesToShow(20);
    };

    const loadMoreHandler = () => {
        setArticlesToShow((prev) => prev + 20);
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            {/* Header */}
            <header className="bg-white shadow py-6">
                <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
                    <h1 className="text-3xl font-bold text-indigo-700 mb-4 sm:mb-0">📰 TheNews</h1>
                    <form
                        onSubmit={searchNewsHandler}
                        className="flex w-full sm:w-auto gap-2"
                    >
                        <input
                            type="text"
                            value={zone}
                            onChange={(e) => setZone(e.target.value)}
                            placeholder="Search topic or country"
                            className="w-full sm:w-72 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition"
                        >
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </button>
                    </form>
                </div>
            </header>

            {/* News Grid */}
            <main className="max-w-6xl mx-auto px-4 py-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {apiData.slice(0, articlesToShow).map((article, index) => (
                        article.urlToImage && (
                            <div
                                key={article.url || index}
                                className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 flex flex-col overflow-hidden"
                            >
                                <img
                                    src={article.urlToImage}
                                    alt={article.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-5 flex-1 flex flex-col">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-1">
                                        {article.title}
                                    </h2>

                                    {/* ✅ Published by */}

                                    <p className="text-gray-600 text-sm flex-grow">
                                        {article.description}
                                    </p><br></br>
                                    <p className="text-sm text-gray-500 mb-2">
                                        Published by {article.source?.name || "Unknown Source"}
                                    </p>

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

                        )
                    ))}
                </div>

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
            </main>
        </div>
    );
};
