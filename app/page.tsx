"use client";
import { useState } from "react";
import { Client } from "@gradio/client";
import { FaRocket, FaPlus, FaPen, FaCog, FaHistory } from "react-icons/fa";
import { BiUserCircle } from "react-icons/bi";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [ratio, setRatio] = useState("1:1");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(5);

  const generateImage = async () => {
    if (!prompt || credits <= 0) return;
    setLoading(true);
    setCredits((prev) => prev - 1);
    setMessages((prev) => [...prev, { role: "user", content: prompt }]);
    const userPrompt = prompt;
    setPrompt("");

    try {
      const enhancedPrompt = `${userPrompt}, 8k resolution, highly detailed, masterpiece`;
      const client = await Client.connect("siyammolla404/Siyam");
      const result = await client.predict("/generate_image", { prompt: enhancedPrompt });
      // @ts-ignore
      const imageUrl = (result.data as any)[0]?.url || (result.data as any)[0];
      setMessages((prev) => [...prev, { role: "ai", content: imageUrl }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "ai", content: "Error generating image." }]);
      setCredits((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white text-gray-900 font-sans overflow-hidden">
      
      {/* Sidebar - Desktop Only */}
      <aside className="w-64 bg-[#f0f4f9] hidden md:flex flex-col p-4 border-r border-gray-200">
        <button className="flex items-center gap-3 bg-[#e9eef6] hover:bg-[#dde3ea] p-3 rounded-xl transition mb-8 font-medium">
          <FaPen className="text-gray-600" /> New Chat
        </button>
        <div className="flex-1 overflow-y-auto space-y-2">
          <p className="text-sm font-semibold text-gray-500 px-2 uppercase tracking-wider">History</p>
          <div className="flex items-center gap-3 p-2 hover:bg-[#dde3ea] rounded-lg cursor-pointer text-sm">
            <FaHistory className="text-gray-400" /> Previous Task...
          </div>
        </div>
        <div className="mt-auto border-t border-gray-300 pt-4 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <BiUserCircle className="text-3xl text-blue-600" />
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">Siyam Molla</p>
              <p className="text-xs text-blue-600">Credits: {credits}</p>
            </div>
          </div>
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition">Get Credit</button>
          <button className="flex items-center gap-2 text-gray-600 hover:text-black transition p-2 text-sm"><FaCog /> Settings</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative h-full bg-white">
        
        {/* Header - Siyam AI */}
        <header className="p-4 flex justify-between items-center md:px-10">
          <span className="text-xl font-bold text-gray-700">Siyam AI</span>
          <div className="md:hidden text-2xl text-blue-600"><BiUserCircle /></div>
        </header>

        {/* Chat / Result Display */}
        <div className="flex-1 overflow-y-auto px-4 md:px-20 lg:px-40 pb-40">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col justify-center items-center text-center">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#4285f4] via-[#9b72cb] to-[#d96570] bg-clip-text text-transparent mb-4">
                Hello, Siyam
              </h1>
              <p className="text-xl md:text-2xl text-gray-400">Describe what you want to create today.</p>
            </div>
          ) : (
            <div className="space-y-10 pt-10">
              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-4 rounded-2xl max-w-full md:max-w-2xl ${msg.role === 'user' ? 'bg-[#f0f4f9] text-gray-800' : 'bg-white'}`}>
                    {msg.role === 'ai' ? (
                      <img src={msg.content} alt="AI" className="rounded-xl shadow-2xl border border-gray-100 w-full" />
                    ) : (
                      <p className="text-lg">{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-4 text-blue-500 animate-pulse">
                  <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="font-medium">Siyam AI is painting...</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Floating Input Area */}
        <div className="absolute bottom-0 w-full p-4 md:p-10 bg-gradient-to-t from-white via-white to-transparent">
          <div className="max-w-4xl mx-auto flex items-center bg-[#f0f4f9] p-2 md:p-4 rounded-full shadow-lg border border-transparent focus-within:border-blue-300 transition">
            <button className="p-2 text-gray-500 hover:text-blue-600"><FaPlus /></button>
            <select 
              value={ratio} 
              onChange={(e) => setRatio(e.target.value)}
              className="bg-transparent text-sm text-gray-600 outline-none px-2 border-r border-gray-300 mr-2 cursor-pointer"
            >
              <option value="1:1">1:1</option>
              <option value="16:9">16:9</option>
              <option value="9:16">9:16</option>
            </select>
            <input 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && generateImage()}
              placeholder="Ask Siyam ai..."
              className="flex-1 bg-transparent border-none outline-none text-gray-800 px-2 text-lg"
            />
            <button 
              onClick={generateImage}
              className="p-3 bg-black text-white rounded-full hover:scale-110 transition active:scale-95 ml-2 shadow-md"
            >
              <FaRocket />
            </button>
          </div>
          <p className="text-[10px] md:text-xs text-center text-gray-400 mt-3">Siyam AI can make mistakes. All generations are professional grade.</p>
        </div>
      </main>
    </div>
  );
}
