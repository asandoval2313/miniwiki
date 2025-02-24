"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreatePost() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [keywords, setKeywords] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/create-post", {
      method: "POST",
      body: JSON.stringify({
        title,
        content,
        keywords: keywords.split(",").map((kw) => kw.trim()),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      router.push("/"); // Go back to main page after successful post
    } else {
      console.error("Failed to create post");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold mb-6">Create a New Post</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white p-6 rounded-lg shadow-md space-y-4"
      >
        {/* Post Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Post Title
          </label>
          <Input
            type="text"
            placeholder="Enter post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Post Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Post Content
          </label>
          <Textarea
            placeholder="Enter post content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            required
          />
        </div>

        {/* Keywords */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Keywords (comma-separated)
          </label>
          <Input
            type="text"
            placeholder="e.g., orders, checkout, bugfix"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            required
          />
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          Create Post
        </Button>
      </form>
    </div>
  );
}
