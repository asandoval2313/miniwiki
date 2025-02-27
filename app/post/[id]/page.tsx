import { supabase } from "@/utils/supabase/client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PostPageProps {
  params: { id: string };
}

export default async function PostPage({ params }: PostPageProps) {
  const postId = params.id;

  const { data: post, error } = await supabase
    .from("posts")
    .select("*, profiles(first_name, last_name)")
    .eq("id", postId)
    .single();

  if (error || !post) {
    return notFound();
  }

  const authorName = post.profiles
    ? `${post.profiles.first_name} ${post.profiles.last_name}`
    : "Unknown Author";

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <Link href="/" className="flex items-center text-blue-600 hover:underline mb-4">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-2 text-gray-800">{post.title}</h1>

        <div className="text-sm text-gray-500 mb-2">
          Author: {authorName}
        </div>

        <div className="text-sm text-gray-500 mb-6">
          Keywords: {post.keywords.join(", ")}
        </div>

        <div className="text-lg text-gray-700 leading-relaxed mb-6 whitespace-pre-wrap">
          {post.content}
        </div>

        <div className="text-right text-sm text-gray-400">
          Posted on {new Date(post.created_at).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
