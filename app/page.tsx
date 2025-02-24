"use client";

import SearchBar from "@/components/SearchBar";
import { useState } from "react";

export default function Home() {
  const [results, setResults] = useState<string[]>([]);

  const handleSearch = (query: string) => {
    // Mock data
    const mockPosts = ["Orders Bug", "Login Flow", "Payment Gateway", "Order History"];

    // Clear results if query is empty
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    // Filter results based on query
    const filtered = mockPosts.filter((post) =>
      post.toLowerCase().includes(query.toLowerCase())
    );

    setResults(filtered);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold mb-6">Mini-Wiki</h1>
      <SearchBar onSearch={handleSearch} />
      <div className="w-full max-w-2xl mt-4">
        {results.length > 0 ? (
          results.map((res, idx) => (
            <div key={idx} className="p-4 border rounded-lg my-2 shadow">
              {res}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No results found.</p>
        )}
      </div>
    </div>
  );
}
