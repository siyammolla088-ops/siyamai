// path: app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Client } from "@gradio/client";
import { FaPlus, FaRegUserCircle, FaPaperPlane, FaSignOutAlt } from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // স্টেট ম্যানেজমেন্ট
  const [prompt, setPrompt] = useState("");
  const [ratio, setRatio] = useState("1:1");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(5);

  // ১. ইউজার লগইন চেক (Firebase Auth)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setAuthLoading(false);
      } else {
        router.push("/login"); // লগইন না থাকলে লগইন পেজে পাঠাবে
      }
    });
    return () => unsubscribe();
  }, [router]);

  // ২. ইমেজ জেনারেশন ফাংশন (Gradio Client)
  const generateImage = async () => {
    if (!prompt || credits <= 0) return;

    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: prompt }]);

    try {
      const client = await Client.connect("black-forest-labs/FLUX.1-schnell");
      const result = await client.predict("/predict", {
        prompt: prompt,
        seed: 0,
        randomize_seed: true,
        width: ratio === "1:1" ? 1024 : ratio === "16:9" ? 1344 : 768,
        height: ratio === "1:1" ? 1024 : ratio === "16:9" ? 768 : 1344,
        num_inference_steps: 4,
      });

      // টাইপ এরর ফিক্সিং (as any ব্যবহার করে)
      const data = result.data as any[];
      const imageUrl = data[0]?.url || data[0];

      setMessages((prev) => [...prev, { role: "ai", content: imageUrl }]);
      setCredits((prev) => prev - 1);
      setPrompt("");
    } catch (error) {
      console.error("ইমেজ জেনারেশন এরর:", error);
    } finally {
      setLoading(false);
    }
  };

  // ৩. লগআউট ফাংশন
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("লগআউট এরর:", error);
    }
  };

  // লোডিং স্ক্রিন
  if (authLoading) {
    return (
      <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "sans-serif" }}>
        Loading Siyam AI...
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "#fff", color: "#1f1f1f", fontFamily: "sans-serif" }}>
      {/* হেডার অংশ */}
      <header style={{ padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <HiOutlineSparkles size={24} color="#4285f4" />
          <span style={{ fontSize: "20px", fontWeight: "500" }}>Siyam AI</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ padding: "4px 12px", backgroundColor: "#f1f3f4", borderRadius: "16px", fontSize: "13px" }}>
            Credits: {credits}
          </div>
          <img src={user?.photoURL} alt="Profile" style={{ width: "32px", height: "32px", borderRadius: "50%" }} />
          <button onClick={handleLogout} style={{ border: "none", background: "none", cursor: "pointer", color: "#5f6368" }} title="Logout">
            <FaSignOutAlt size={20} />
          </button>
        </div>
      </header>

      {/* চ্যাট/মেসেজ এরিয়া */}
      <main style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: "100px" }}>
            <h2 style={{ fontSize: "28px", color: "#1f1f1f" }}>How can I help you today?</h2>
          </div>
        ) : (
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            {messages.map((msg, index) => (
              <div key={index} style={{ marginBottom: "24px", textAlign: msg.role === "user" ? "right" : "left" }}>
                {msg.role === "ai" ? (
                  <img src={msg.content} alt="Generated AI" style={{ maxWidth: "100%", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                ) : (
                  <div style={{ display: "inline-block", padding: "10px 16px", backgroundColor: "#f1f3f4", borderRadius: "18px", fontSize: "16px" }}>
                    {msg.content}
                  </div>
                )}
              </div>
            ))}
            {loading && <p style={{ color: "#5f6368" }}>Generating your image...</p>}
          </div>
        )}
      </main>

      {/* ইনপুট এরিয়া */}
      <footer style={{ padding: "20px", maxWidth: "850px", width: "100%", margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", backgroundColor: "#f0f4f9", borderRadius: "28px", padding: "8px 16px" }}>
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to create..."
            style={{ border: "none", background: "transparent", padding: "12px", fontSize: "16px", outline: "none" }}
            onKeyPress={(e) => e.key === "Enter" && generateImage()}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 8px" }}>
            <select 
              value={ratio} 
              onChange={(e) => setRatio(e.target.value)}
              style={{ border: "none", background: "#fff", borderRadius: "12px", padding: "4px 8px", fontSize: "12px", cursor: "pointer" }}
            >
              <option value="1:1">1:1 Square</option>
              <option value="16:9">16:9 Wide</option>
              <option value="9:16">9:16 Tall</option>
            </select>
            <button 
              onClick={generateImage}
              disabled={loading || !prompt}
              style={{ backgroundColor: "#1f1f1f", color: "#fff", border: "none", borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", opacity: loading ? 0.5 : 1 }}
            >
              <FaPaperPlane size={16} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
