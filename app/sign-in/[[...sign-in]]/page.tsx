"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070B14]">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center">
              <span className="text-white font-black text-sm">O</span>
            </div>
            <span className="font-bold text-xl text-white tracking-tight">operexo</span>
          </div>
          <p className="text-slate-400 text-sm">Yönetim paneline giriş yapın</p>
        </div>
        <SignIn
          fallbackRedirectUrl="/admin"
          appearance={{
            variables: {
              colorBackground: "#0D1117",
              colorText: "#ffffff",
              colorPrimary: "#6366f1",
              colorInputBackground: "#1f2937",
              colorInputText: "#ffffff",
            },
          }}
        />
      </div>
    </div>
  );
}
