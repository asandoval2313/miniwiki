import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { title, content, keywords } = await req.json();

  const { data, error } = await supabase.from("posts").insert([
    {
      title,
      content,
      keywords,
    },
  ]);

  if (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 200 });
}
