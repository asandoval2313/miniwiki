'use client';

import { signOut } from "@/app/actions";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/utils/supabase/client";
import { LogOut, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface Post {
  id: string;
  title: string;
  content: string;
  keywords: string[];
  created_at: string;
}

export default function Home() {
  const [results, setResults] = useState<Post[]>([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSearch = async (query: string) => {
    setSearchPerformed(true);

    const lowerQuery = query.toLowerCase().trim();

    if (lowerQuery === "") {
      setResults([]);
      return;
    }

    const { data, error } = await supabase.from("posts").select("*");

    if (error) {
      console.error("Error fetching posts:", error);
      setResults([]);
      return;
    }

    if (data) {
      const filtered = data.filter((post) => {
        return (
          post.title.toLowerCase().includes(lowerQuery) ||
          post.content.toLowerCase().includes(lowerQuery) ||
          post.keywords.some((keyword: string) =>
            keyword.toLowerCase().includes(lowerQuery)
          )
        );
      });

      setResults(filtered);
    }
  };

  const handleCreatePost = () => {
    router.push("/create-post");
  };

  const handleViewPost = (id: string) => {
    router.push(`/post/${id}`);
  };

  const handleSignOut = () => {
    startTransition(() => {
      signOut();
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative">
      <Button
        onClick={handleCreatePost}
        className="absolute top-4 right-16 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow"
        aria-label="Create New Post"
        size="icon"
      >
        <Plus size={24} />
      </Button>

      <Button
        onClick={handleSignOut}
        className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow"
        aria-label="Sign Out"
        size="icon"
        variant="destructive"
        disabled={isPending}
      >
        <LogOut size={24} />
      </Button>

      <h1 className="text-4xl font-bold mb-6">Mini-Wiki</h1>
      <SearchBar onSearch={handleSearch} />

      <div className="w-full max-w-2xl mt-4">
        {searchPerformed ? (
          results.length > 0 ? (
            results.map((post) => (
              <div
                key={post.id}
                onClick={() => handleViewPost(post.id)}
                className="p-4 border rounded-lg my-2 shadow cursor-pointer hover:bg-gray-100 transition"
              >
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <p className="text-gray-600 line-clamp-2">{post.content}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Keywords: {post.keywords.join(", ")}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No results found.</p>
          )
        ) : (
          <p className="text-gray-500 text-center">Search to see results.</p>
        )}
      </div>
    </div>
  );
}
