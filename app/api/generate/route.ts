import { NextResponse } from "next/server";
import { Client } from "@gradio/client";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    // 서버 사이드에서 Gradio 연결 (여기서 실행하면 node:buffer 에러가 안 납니다!)
    const client = await Client.connect("siyammolla404/Siyam");
    const result = await client.predict("/generate_image", { prompt });

    // @ts-ignore
    const imageUrl = result.data[0]?.url || result.data[0];

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Gradio API Error:", error);
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
  }
}
