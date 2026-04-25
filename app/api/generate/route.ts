import { NextResponse } from "next/server"; // 'i' ছোট হাতের হবে
import { client } from "@gradio/client";

export async function POST(req: Request) {
  try {
    // ১. রিকোয়েস্ট থেকে প্রম্পটটি সংগ্রহ করা
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // ২. গ্র্যাডিও স্পেসের সাথে কানেক্ট করা
    const app = await client("siyammolla404/Siyam");
    
    // ৩. ইমেজ জেনারেট করার জন্য প্রেডিক্ট ফাংশন কল করা (অ্যারে ফরম্যাটে [prompt])
    const result = await app.predict("/generate_image", [prompt]);

    // ৪. রেজাল্ট থেকে ইমেজের সঠিক লিঙ্কটি বের করে আনা
    // @ts-ignore
    const rawData = result.data[0];
    const imageUrl = typeof rawData === 'object' ? rawData?.url : rawData;

    if (!imageUrl) {
      throw new Error("No image URL found in response");
    }

    return NextResponse.json({ imageUrl });

  } catch (error: any) {
    console.error("Gradio API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate image" }, 
      { status: 500 }
    );
  }
}
