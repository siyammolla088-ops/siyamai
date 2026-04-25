import { NextResponse } from "next/server";
import { client } from "@gradio/client"; // 'Client' এর বদলে 'client' (ছোট হাতের)

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    // এখানে কানেক্ট করার পদ্ধতিটি একটু পরিবর্তন হয়েছে
    const app = await client("siyammolla404/Siyam");
    const result = await app.predict("/generate_image", { 
      prompt: prompt 
    });

    // @ts-ignore
    const imageUrl = result.data[0]?.url || result.data[0];

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Gradio API Error:", error);
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
  }
}
