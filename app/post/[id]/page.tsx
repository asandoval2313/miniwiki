import { supabase } from "@/utils/supabase/client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PostPageProps {
  params: { id: string };
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = params;

  // Fetch post by ID from Supabase
  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !post) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        {/* Back to Home Button */}
        <Link href="/" className="flex items-center text-blue-600 hover:underline mb-4">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>

        {/* Title */}
        <h1 className="text-4xl font-bold mb-2 text-gray-800">{post.title}</h1>

        {/* Keywords under title */}
        <div className="text-sm text-gray-500 mb-6">
          Keywords: {post.keywords.join(", ")}
        </div>

        {/* Post Content */}
        <div className="text-lg text-gray-700 leading-relaxed mb-6 whitespace-pre-wrap">
          {post.content}
        </div>

        {/* Created At Date */}
        <div className="text-right text-sm text-gray-400">
          Posted on {new Date(post.created_at).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
