"use client";
import { useState, useEffect } from "react";
import { Client } from "@gradio/client";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FaPlus, FaPaperPlane, FaPen, FaHistory, FaCog, FaSignOutAlt } from "react-icons/fa";
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
      const finalPrompt = `${currentPrompt}, 8k, photorealistic, cinematic masterpiece --ar ${ratio}`;
      const client = await Client.connect("siyammolla404/Siyam");
      const result = await client.predict("/generate_image", { prompt: finalPrompt });
      // @ts-ignore
      const imageUrl = result.data[0].url || result.data[0];
      setMessages(prev => [...prev, { role: "ai", content: imageUrl }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "ai", content: "Error occurred. Try again." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="h-screen flex items-center justify-center">Loading Siyam AI...</div>;

  return (
    <div className="flex h-screen bg-[#f8fafd] text-[#1f1f1f] font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#f0f4f9] p-4 hidden md:flex flex-col border-r border-gray-200">
        <button className="flex items-center gap-2 bg-[#e9eef6] p-3 rounded-xl mb-6 hover:bg-gray-200"><FaPen /> New Chat</button>
        <div className="flex-1 overflow-auto"><p className="text-xs font-bold text-gray-500 mb-2 uppercase">Recent</p></div>
        <div className="border-t pt-4">
          <button onClick={() => signOut(auth)} className="flex items-center gap-2 text-red-500 text-sm"><FaSignOutAlt /> Log out</button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col relative bg-white">
        <header className="p-4 flex justify-between items-center px-8 border-b md:border-none">
          <div className="text-xl font-medium text-gray-600">Siyam AI</div>
          <img src={user.photoURL} className="w-8 h-8 rounded-full border shadow-sm" alt="profile" />
        </header>

        <div className="flex-1 overflow-y-auto px-4 md:px-20 lg:px-40 pb-32">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col justify-center">
              <h1 className="text-5xl font-medium bg-gradient-to-r from-blue-500 to-red-400 bg-clip-text text-transparent mb-2">Hello, {user.displayName?.split(" ")[0]}</h1>
              <p className="text-4xl font-medium text-gray-300">How can I help you create today?</p>
            </div>
          ) : (
            <div className="mt-8 space-y-8">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'ai' && <HiOutlineSparkles className="text-blue-500" size={24} />}
                  <div className={`p-4 rounded-2xl max-w-xl ${m.role === 'user' ? 'bg-[#f0f4f9]' : ''}`}>
                    {m.role === 'ai' && m.content.startsWith("http") ? <img src={m.content} className="rounded-xl shadow-lg border" /> : <p className="text-lg">{m.content}</p>}
                  </div>
                </div>
              ))}
              {loading && <div className="text-blue-500 animate-pulse font-medium ml-10 italic">Creating image...</div>}
            </div>
          )}
        </div>

        {/* Floating Input */}
        <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-white via-white to-transparent">
          <div className="max-w-4xl mx-auto bg-[#f0f4f9] rounded-full p-2 flex items-center shadow-lg border border-gray-100">
            <button className="p-3 text-gray-500"><FaPlus /></button>
            <select value={ratio} onChange={(e) => setRatio(e.target.value)} className="bg-transparent text-sm border-r pr-2 outline-none">
              <option>1:1</option><option>16:9</option><option>9:16</option>
            </select>
            <input value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && generateImage()} className="flex-1 bg-transparent px-4 outline-none text-lg" placeholder="Ask Siyam AI..." />
            <button onClick={generateImage} className={`p-4 rounded-full transition ${prompt ? 'bg-black text-white' : 'bg-gray-300 text-gray-500'}`}><FaPaperPlane /></button>
          </div>
          <p className="text-center text-[10px] text-gray-400 mt-2 uppercase">Siyam AI Professional Grade</p>
        </div>
      </main>
    </div>
  );
                                                }
