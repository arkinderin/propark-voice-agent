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
              colorText: "#f1f5f9",
              colorTextSecondary: "#94a3b8",
              colorTextOnPrimaryBackground: "#ffffff",
              colorPrimary: "#6366f1",
              colorNeutral: "#94a3b8",
              colorInputBackground: "#1f2937",
              colorInputText: "#f1f5f9",
              colorDanger: "#f87171",
              borderRadius: "0.75rem",
              fontFamily: "inherit",
            },
            elements: {
              card: "bg-[#0D1117] border border-white/10 shadow-2xl",
              headerTitle: "text-white font-bold",
              headerSubtitle: "text-slate-400",
              socialButtonsBlockButton: "border-white/10 text-slate-300 hover:bg-white/5",
              socialButtonsBlockButtonText: "text-slate-300",
              dividerLine: "bg-white/10",
              dividerText: "text-slate-500",
              formFieldLabel: "text-slate-300",
              formFieldInput: "bg-[#1f2937] border-white/10 text-white placeholder:text-slate-500",
              formButtonPrimary: "bg-indigo-600 hover:bg-indigo-500 text-white",
              footerActionLink: "text-indigo-400 hover:text-indigo-300",
              footerActionText: "text-slate-500",
              identityPreviewText: "text-slate-300",
              identityPreviewEditButton: "text-indigo-400",
              alternativeMethodsBlockButton: "border-white/10 text-slate-300 hover:bg-white/5",
              otpCodeFieldInput: "border-white/20 text-white bg-[#1f2937]",
            },
          }}
        />
      </div>
    </div>
  );
}
