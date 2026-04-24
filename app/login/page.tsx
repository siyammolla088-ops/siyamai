// path: app/login/page.tsx
"use client";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/"); // লগইন সফল হলে মূল পেজে পাঠিয়ে দেবে
    } catch (error) {
      console.error("লগইন ফেইল হয়েছে:", error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f8fafd', fontFamily: 'sans-serif' }}>
      <div style={{ padding: '40px', backgroundColor: 'white', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', textAlign: 'center', maxWidth: '400px', width: '90%' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', background: 'linear-gradient(90deg, #4285f4, #9b72cb, #d96570)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '10px' }}>
          Siyam AI
        </h1>
        <p style={{ fontSize: '18px', color: '#5f6368', marginBottom: '40px' }}>Sign up for free to start creating</p>
        
        <button 
          onClick={handleLogin}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', width: '100%', padding: '14px', backgroundColor: 'white', border: '1px solid #dadce0', borderRadius: '32px', fontSize: '16px', fontWeight: '500', cursor: 'pointer', transition: 'background-color 0.3s' }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f3f4'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
        >
          <FcGoogle size={24} />
          Continue with Google
        </button>
        
        <p style={{ marginTop: '24px', fontSize: '12px', color: '#70757a' }}>
          By continuing, you agree to Siyam AI's Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
