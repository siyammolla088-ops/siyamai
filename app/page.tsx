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
  const [authLoading, setAuthLoading] = useState(true); // ইউজার চেক করার জন্য
  
  // আগের স্টেটগুলো...
  const [prompt, setPrompt] = useState("");
  const [ratio, setRatio] = useState("1:1");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(5);

  // ইউজার লগইন অবস্থায় আছে কি না তা চেক করা
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // ইউজার পাওয়া গেলে সেভ করবে
        setAuthLoading(false);
      } else {
        router.push("/login"); // ইউজার না থাকলে লগইন পেজে পাঠাবে
      }
    });
    return () => unsubscribe();
  }, [router]);

  // লগআউট ফাংশন
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("লগআউট এরর:", error);
    }
  };

  // যদি লগইন স্ট্যাটাস চেক হতে থাকে, তাহলে সাদা স্ক্রিন বা লোডিং দেখাবে
  if (authLoading) {
    return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading Siyam AI...</div>;
  }

  // ... আপনার আগের generateImage ফাংশন এখানে থাকবে ...

  return (
    // ... আপনার আগের রিটার্ন করা UI ডিজাইন এখানে থাকবে ...
    
    // শুধু হেডারের অংশে লগআউট বাটনটি এভাবে যোগ করে দিতে পারেন:
    /*
      <header style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '22px', fontWeight: '500' }}>Siyam AI</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '14px', color: '#5f6368' }}>{user?.email}</span>
          <button onClick={handleLogout} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#d93025' }} title="Log out">
            <FaSignOutAlt size={24} />
          </button>
        </div>
      </header>
    */
  );
}
