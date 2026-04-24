"use client";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FaPlus, FaPaperPlane, FaPen, FaSignOutAlt } from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [ratio, setRatio] = useState("1:1");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) setUser(currentUser);
      else router.push("/login");
    });
    return () => unsubscribe();
  }, [router]);

  const generateImage = async () => {
    if (!prompt || loading) return;
    const currentPrompt = prompt;
    setPrompt("");
    setLoading(true);
    setMessages(prev => [...prev, { role: "user", content: currentPrompt }]);

    try {
      // Dynamic import to avoid build errors
      const { Client } = await import("@gradio/client");
      const finalPrompt = `${currentPrompt}, 8k, masterpiece, cinematic --ar ${ratio}`;
      const client = await Client.connect("siyammolla404/Siyam");
      const result = await client.predict("/generate_image", { prompt: finalPrompt });
      
      // @ts-ignore
      const imageUrl = result.data[0].url || result.data[0];
      setMessages(prev => [...prev, { role: "ai", content: imageUrl }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "ai", content: "Error: Image could not be generated." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="flex h-screen bg-[#f8fafd] text-[#1f1f1f]">
      {/* Sidebar - Desktop Only */}
      <aside className="w-64 bg-[#f0f4f9] p-4 hidden md:flex flex-col border-r border-gray-200">
        <button onClick={() => window.location.reload()} className="flex items-center gap-2 bg-[#e9eef6] p-3 rounded-xl mb-6 hover:bg-gray-200 shadow-sm transition">
          <FaPen /> New Chat
        </button>
        <div className="flex-1 overflow-auto">
          <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Recent</p>
        </div>
        <button onClick={() => signOut(auth)} className="flex items-center gap-2 text-red-500 text-sm p-2 hover:bg-red-50 rounded-lg">
          <FaSignOutAlt /> Log out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative bg-white">
        <header className="p-4 flex justify-between items-center px-6 md:px-10">
          <div className="text-2xl font-semibold text-gray-700">Siyam AI</div>
          <img src={user.photoURL} className="w-9 h-9 rounded-full border-2 border-white shadow-md" alt="profile" />
        </header>

        <div className="flex-1 overflow-y-auto px-4 md:px-20 lg:px-40 pb-32">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col justify-center items-start">
              <h1 className="text-5xl font-medium bg-gradient-to-r from-[#4285f4] via-[#9b72cb] to-[#d96570] bg-clip-text text-transparent mb-4">
                Hello, {user.displayName?.split(" ")[0]}
              </h1>
              <p className="text-4xl font-medium text-[#c4c7c5]">How can I help you today?</p>
            </div>
          ) : (
            <div className="mt-8 space-y-10">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'ai' && <HiOutlineSparkles className="text-blue-500 mt-2" size={24} />}
                  <div className={`p-4 rounded-3xl max-w-2xl ${m.role === 'user' ? 'bg-[#f0f4f9] text-[#1f1f1f]' : ''}`}>
                    {m.role === 'ai' && m.content.startsWith("http") ? (
                      <img src={m.content} className="rounded-2xl shadow-xl border w-full max-w-lg" alt="AI result" />
                    ) : (
                      <p className="text-lg leading-relaxed">{m.content}</p>
                    )}
                  </div>
                </div>
              ))}
              {loading && <div className="text-blue-500 animate-pulse font-medium ml-12 italic">Siyam AI is creating...</div>}
            </div>
          )}
        </div>

        {/* Input Field - Gemini Style */}
        <div className="absolute bottom-0 w-full p-6 bg-white bg-opacity-90">
          <div className="max-w-4xl mx-auto bg-[#f0f4f9] rounded-full p-2 flex items-center shadow-lg border border-transparent focus-within:border-blue-300 transition">
            <button className="p-3 text-gray-500 hover:text-blue-500 transition"><FaPlus /></button>
            <select value={ratio} onChange={(e) => setRatio(e.target.value)} className="bg-transparent text-sm border-r border-gray-300 pr-3 outline-none cursor-pointer font-medium">
              <option>1:1</option><option>16:9</option><option>9:16</option>
            </select>
            <input 
              value={prompt} 
              onChange={(e) => setPrompt(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && generateImage()} 
              className="flex-1 bg-transparent px-4 outline-none text-lg placeholder-gray-400" 
              placeholder="Ask Siyam AI..." 
            />
            <button 
              onClick={generateImage} 
              className={`p-4 rounded-full transition-all ${prompt ? 'bg-[#1f1f1f] text-white hover:scale-105' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              <FaPaperPlane />
            </button>
          </div>
          <p className="text-center text-[10px] text-gray-400 mt-3 uppercase tracking-tighter">Siyam AI Professional Image Model</p>
        </div>
      </main>
    </div>
  );
}
