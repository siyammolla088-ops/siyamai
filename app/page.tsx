"use client";
import { useState } from "react";
import { Client } from "@gradio/client";
import { FaRocket, FaPlus, FaPen, FaCog } from "react-icons/fa";
import { BiUserCircle } from "react-icons/bi";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [ratio, setRatio] = useState("1:1");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(5); // ডেমো ক্রেডিট

  const generateImage = async () => {
    if (!prompt || credits <= 0) {
      if (credits <= 0) alert("Get Credit! (Payment or Ads modal will show here)");
      return;
    }

    setLoading(true);
    setCredits((prev) => prev - 1); // ১ ক্রেডিট কেটে নেওয়া হলো
    
    // ইউজারের মেসেজ স্ক্রিনে দেখানো
    setMessages((prev) => [...prev, { role: "user", content: prompt }]);
    const userPrompt = prompt;
    setPrompt("");

    try {
      // ইউজারের অজান্তে ভালো ছবি পাওয়ার জন্য প্রম্পট বড় করা হলো
      const hiddenEnhancedPrompt = `${userPrompt}, 8k resolution, 4k, highly detailed, masterpiece, professional photography`;
      
      // আপনার স্পেস API কানেক্ট করা
      const client = await Client.connect("siyammolla404/Siyam");
      const result = await client.predict("/generate_image", { 
        prompt: hiddenEnhancedPrompt 
      });
      
      // টাইপ এরর ফিক্স করতে (result.data as any) ব্যবহার করা হয়েছে
      // @ts-ignore
      const imageUrl = (result.data as any)[0]?.url || (result.data as any)[0];
      
      setMessages((prev) => [...prev, { role: "ai", content: imageUrl }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [...prev, { role: "ai", content: "Error generating image. Please try again." }]);
      setCredits((prev) => prev + 1); // এরর হলে ক্রেডিট ফেরত দেওয়া
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white text-gray-800 font-sans">
      
      {/* Sidebar - History & Settings */}
      <div className="w-72 bg-gray-50 border-r border-gray-200 hidden md:flex flex-col p-4 relative">
        <div className="flex justify-between items-center mb-6">
          <button className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-full font-medium transition">
            <FaPen className="text-gray-600 text-sm" /> New Chat
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-500 mb-3 px-2">Recent</p>
          {/* History items will go here */}
        </div>

        {/* User Profile & Credits Bottom Section */}
        <div className="mt-auto border-t border-gray-200 pt-4">
           <div className="flex items-center gap-3 px-2 mb-3">
              <BiUserCircle className="text-3xl text-gray-600" />
              <div>
                <p className="font-semibold text-sm">siyammolla088@gmail.com</p>
                <p className="text-xs text-blue-600 font-bold">Credits: {credits}</p>
              </div>
           </div>
           <button className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 py-2 rounded-lg text-sm font-semibold transition mb-2">
             Get Credit
           </button>
           <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-2 text-sm transition">
             <FaCog /> Settings
           </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Header for Mobile */}
        <div className="md:hidden p-4 text-xl font-bold text-gray-700 border-b">Siyam AI</div>

        <div className="flex-1 overflow-y-auto p-4 md:px-32 lg:px-48 pb-32">
          {messages.length === 0 ? (
             <div className="h-full flex flex-col justify-center items-center text-center mt-[-50px]">
               <h1 className="text-5xl font-medium bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
                 Siyam AI
               </h1>
               <p className="text-xl text-gray-500">How can I help you create today?</p>
             </div>
          ) : (
            <div className="space-y-8 mt-10">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-4 rounded-2xl max-w-xl ${msg.role === 'user' ? 'bg-gray-100 text-gray-800' : ''}`}>
                    {msg.role === 'ai' ? (
                       <img src={msg.content} alt="AI Generated" className="rounded-xl shadow-lg border border-gray-200" />
                    ) : (
                       msg.content
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start items-center gap-3 p-4">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-500 font-medium">Siyam AI is generating...</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 w-full bg-gradient-to-t from-white via-white to-transparent pt-10 pb-6 px-4 md:px-32 lg:px-48">
          <div className="flex items-center bg-gray-100 p-2 md:p-3 rounded-full shadow-sm border border-gray-300 focus-within:ring-1 focus-within:ring-gray-400">
            
            <button className="p-3 text-gray-500 hover:text-gray-800 transition">
              <FaPlus />
            </button>
            
            <select 
              value={ratio} 
              onChange={(e) => setRatio(e.target.value)}
              className="bg-transparent text-sm text-gray-600 outline-none cursor-pointer border-r border-gray-300 pr-2 mr-2"
            >
              <option value="1:1">1:1</option>
              <option value="9:16">9:16</option>
              <option value="16:9">16:9</option>
            </select>

            <input 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && generateImage()}
              className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-500 px-2 text-base md:text-lg"
              placeholder="Ask Siyam ai..."
            />
            
            <button 
              onClick={generateImage} 
              className="p-3 bg-black text-white rounded-full hover:bg-gray-800 transition shadow-md ml-2"
            >
              <FaRocket />
            </button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">Siyam AI can make mistakes. Consider verifying important information.</p>
        </div>
      </div>
    </div>
  );
}
