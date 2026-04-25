import { NextResponse } from "next/server";
import { client } from "@gradio/client";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const app = await client("siyammolla404/Siyam");
    
    // এখানে পরিবর্তন: অবজেক্টের বদলে অ্যারে [prompt] ব্যবহার করা হয়েছে
    const result = await app.predict("/generate_image", [prompt]);

    // @ts-ignore
    const imageUrl = result.data[0]?.url || result.data[0];

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Gradio API Error:", error);
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
  }
}
