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
      router.push("/");
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white font-sans">
      <div className="p-10 bg-white rounded-3xl shadow-xl text-center max-w-sm w-full border border-gray-100">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-red-400 bg-clip-text text-transparent mb-2">
          Siyam AI
        </h1>
        <p className="text-gray-500 mb-10 text-lg">Sign up for free to start creating</p>
        <button 
          onClick={handleLogin}
          className="flex items-center justify-center gap-3 w-full py-3 border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition shadow-sm"
        >
          <FcGoogle size={24} /> Continue with Google
        </button>
      </div>
    </div>
  );
}
