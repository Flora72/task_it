import React from "react";
import { ArrowRight } from "lucide-react";

export default function LandingPage({ onOpenLogin, onOpenRegister }) {
  return (
    <div className="min-h-screen bg-[#0d0e12] text-white flex flex-col justify-between px-6 sm:px-14 py-6 overflow-hidden relative selection:bg-amber-500 selection:text-black">
      {/* Top Navbar */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <span className="text-xl font-black tracking-tight text-white">TASK IT</span>
          
        </div>

        <button
          type="button"
          onClick={onOpenLogin}
          className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs transition active:scale-95 glow-btn cursor-pointer"
        >
          Login
        </button>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto w-full my-auto py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        {/* Left Headline */}
        <div className="lg:col-span-6 text-left">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
            Manage all <br />
            your tasks
          </h1>
          <p className="text-lg sm:text-2xl text-zinc-400 mt-4 font-normal tracking-wide">
            Anytime, Anywhere
          </p>

          <div className="mt-8">
            <button
              type="button"
              onClick={onOpenRegister}
              className="px-7 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-extrabold text-sm transition flex items-center gap-3 active:scale-95 glow-btn cursor-pointer"
            >
              <span>Get Started</span>
            </button>
          </div>
        </div>

        {/* Right Visual Image */}
        <div className="lg:col-span-6 relative flex items-center justify-center min-h-[380px] sm:min-h-[460px]">
          <div className="absolute w-80 h-80 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-sm sm:max-w-md animate-float-1">
            <img
              src="/hero-character.png"
              alt="Task management character"
              className="w-full h-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)]"
              loading="eager"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full flex items-center justify-between text-zinc-500 text-xs pt-4 border-t border-zinc-800/50 z-20">
        <span>Task It &bull; Organised thoughts</span>
        <button
          type="button"
          onClick={onOpenLogin}
          className="text-zinc-400 hover:text-amber-400 transition cursor-pointer"
        >
          Sign In
        </button>
      </footer>
    </div>
  );
}