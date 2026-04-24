"use client";
import { useState } from "react";
import { Client } from "@gradio/client";
import { FaPlus, FaRegUserCircle, FaPaperPlane } from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [ratio, setRatio] = useState("1:1");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (!prompt) return;
    const currentPrompt = prompt;
    setPrompt("");
    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: currentPrompt }]);

    try {
      const client = await Client.connect("siyammolla404/Siyam");
      const result = await client.predict("/generate_image", { 
        prompt: `${currentPrompt}, 8k resolution, professional cinematic masterpiece` 
      });
      // @ts-ignore
      const imageUrl = (result.data as any)[0]?.url || (result.data as any)[0];
      setMessages((prev) => [...prev, { role: "ai", content: imageUrl }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: "ai", content: "Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafd', color: '#1f1f1f', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      
      {/* Header */}
      <header style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafd' }}>
        <div style={{ fontSize: '22px', fontWeight: '500', color: '#444746' }}>Siyam AI</div>
        <FaRegUserCircle size={32} color="#444746" style={{ cursor: 'pointer' }} />
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', paddingBottom: '120px' }}>
        {messages.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 20px', textAlign: 'center' }}>
            <h1 style={{ fontSize: 'clamp(32px, 8vw, 56px)', fontWeight: '500', marginBottom: '10px', background: 'linear-gradient(90deg, #4285f4, #9b72cb, #d96570)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Hello, Siyam
            </h1>
            <p style={{ fontSize: 'clamp(24px, 5vw, 40px)', fontWeight: '500', color: '#c4c7c5' }}>How can I help you create today?</p>
          </div>
        ) : (
          <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto', padding: '20px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ display: 'flex', gap: '15px', maxWidth: '90%' }}>
                  {m.role === 'ai' && <HiOutlineSparkles size={24} color="#4285f4" style={{ marginTop: '5px' }} />}
                  <div style={{ padding: m.role === 'user' ? '12px 20px' : '0', borderRadius: '20px', backgroundColor: m.role === 'user' ? '#e9eef6' : 'transparent' }}>
                    {m.role === 'ai' ? (
                      <img src={m.content} style={{ borderRadius: '16px', width: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1px solid #e3e3e3' }} alt="AI Output" />
                    ) : (
                      <p style={{ fontSize: '16px', margin: 0, color: '#1f1f1f' }}>{m.content}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {loading && <div style={{ color: '#4285f4', paddingLeft: '40px', fontStyle: 'italic' }}>Creating your masterpiece...</div>}
          </div>
        )}
      </main>

      {/* Floating Premium Input Box (Gemini Style) */}
      <div style={{ position: 'fixed', bottom: '0', left: '0', width: '100%', padding: '20px', background: 'linear-gradient(transparent, #f8fafd 30%)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '32px', padding: '8px 16px', display: 'flex', alignItems: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #e3e3e3' }}>
          
          <button style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer', color: '#444746' }}>
            <FaPlus size={18} />
          </button>

          <select 
            value={ratio} 
            onChange={(e) => setRatio(e.target.value)}
            style={{ background: '#f0f4f9', border: 'none', borderRadius: '12px', padding: '4px 8px', fontSize: '12px', cursor: 'pointer', outline: 'none', marginRight: '10px' }}
          >
            <option>1:1</option><option>16:9</option><option>9:16</option>
          </select>

          <input 
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && generateImage()}
            placeholder="Describe what you want to create..."
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: '16px', padding: '10px', backgroundColor: 'transparent', color: '#1f1f1f' }}
          />

          <button 
            onClick={generateImage}
            disabled={!prompt || loading}
            style={{ 
              background: prompt ? '#1a73e8' : '#f1f3f4', 
              color: prompt ? 'white' : '#9aa0a6', 
              border: 'none', 
              borderRadius: '50%', 
              width: '40px', 
              height: '40px', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              cursor: prompt ? 'pointer' : 'default',
              transition: 'all 0.3s ease'
            }}
          >
            <FaPaperPlane size={18} />
          </button>
        </div>
        <p style={{ textAlign: 'center', fontSize: '11px', color: '#70757a', marginTop: '12px' }}>
          Siyam AI can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
}
