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
      const client = await Client.connect("siyammolla404/Siyam");
      const result = await client.predict("/generate_image", { 
        prompt: `${userPrompt}, 8k resolution, cinematic, high quality` 
      });
      // @ts-ignore
      const imageUrl = (result.data as any)[0]?.url || (result.data as any)[0];
      setMessages((prev) => [...prev, { role: "ai", content: imageUrl }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "ai", content: "Error! Try again." }]);
      setCredits((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#ffffff', color: '#1f1f1f', fontFamily: 'sans-serif' }}>
      
      {/* Sidebar - Gemini Style */}
      <aside style={{ width: '280px', backgroundColor: '#f0f4f9', display: 'flex', flexDirection: 'column', padding: '16px', borderRight: '1px solid #e3e3e3' }}>
        <button style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '16px', backgroundColor: '#e9eef6', border: 'none', cursor: 'pointer', fontWeight: '500', marginBottom: '32px' }}>
          <FaPen /> New Chat
        </button>
        
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <p style={{ fontSize: '12px', fontWeight: '600', color: '#5f6368', paddingLeft: '8px', marginBottom: '16px' }}>RECENT</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
            <FaHistory color="#5f6368" />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Your Image History...</span>
          </div>
        </div>

        {/* User Info & Credits */}
        <div style={{ borderTop: '1px solid #e3e3e3', paddingTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <BiUserCircle size={32} color="#1a73e8" />
            <div>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>Siyam Molla</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#1a73e8', fontWeight: 'bold' }}>{credits} Credits left</p>
            </div>
          </div>
          <button style={{ width: '100%', padding: '10px', backgroundColor: '#1a73e8', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '8px' }}>
            Get Credit
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#5f6368', fontSize: '14px', cursor: 'pointer' }}>
            <FaCog /> Settings
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <header style={{ padding: '16px 24px', fontSize: '20px', fontWeight: '500', color: '#5f6368' }}>
          Siyam AI
        </header>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 10%' }}>
          {messages.length === 0 ? (
            <div style={{ height: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
              <h1 style={{ fontSize: '56px', fontWeight: '500', background: 'linear-gradient(to right, #4285f4, #9b72cb, #d96570)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0' }}>
                Hello, Siyam
              </h1>
              <p style={{ fontSize: '56px', fontWeight: '500', color: '#c4c7c5', margin: '0' }}>How can I help you today?</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ padding: '12px 20px', borderRadius: '20px', backgroundColor: m.role === 'user' ? '#f0f4f9' : 'transparent', maxWidth: '80%' }}>
                    {m.role === 'ai' ? (
                      <img src={m.content} style={{ borderRadius: '12px', width: '100%', maxWidth: '500px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} alt="AI generated" />
                    ) : (
                      <p style={{ fontSize: '18px', margin: 0 }}>{m.content}</p>
                    )}
                  </div>
                </div>
              ))}
              {loading && <div style={{ color: '#4285f4', fontWeight: '500' }}>Siyam AI is generating...</div>}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div style={{ padding: '20px 10%', backgroundColor: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f0f4f9', padding: '8px 20px', borderRadius: '32px', border: '1px solid transparent' }}>
            <FaPlus style={{ color: '#5f6368', marginRight: '16px', cursor: 'pointer' }} />
            <select value={ratio} onChange={(e) => setRatio(e.target.value)} style={{ background: 'none', border: 'none', borderRight: '1px solid #c4c7c5', marginRight: '12px', paddingRight: '8px', outline: 'none' }}>
              <option>1:1</option><option>16:9</option><option>9:16</option>
            </select>
            <input 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && generateImage()}
              placeholder="Ask Siyam ai..." 
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: '16px', padding: '12px 0' }} 
            />
            <button onClick={generateImage} style={{ background: '#1f1f1f', color: 'white', border: 'none', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', marginLeft: '12px' }}>
              <FaRocket />
            </button>
          </div>
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#5f6368', marginTop: '12px' }}>Siyam AI can make mistakes. Professional grade images guaranteed.</p>
        </div>
      </main>
    </div>
  );
}
