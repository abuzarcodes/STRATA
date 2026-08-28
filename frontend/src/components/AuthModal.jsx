import React, { useState } from 'react'
import { ArrowLeft, Shield, Eye, EyeOff, CheckCircle2 } from 'lucide-react'

export default function AuthModal({ activeRole, onBack, onSuccess }) {
  const [identifier, setIdentifier] = useState('9872 5431 0092')
  const [password, setPassword] = useState('••••••••••••')
  const [showPassword, setShowPassword] = useState(false)
  const [is2FAEnabled, setIs2FAEnabled] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSignIn = (method = 'DIGILOCKER') => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      onSuccess()
    }, 600)
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#080E17]/90 backdrop-blur-2xl flex items-center justify-center p-4">
      {/* Figma Frame 11:123 Card */}
      <div className="w-full max-w-md bg-[#0B131E] border border-[#1E293B] rounded-3xl p-8 shadow-2xl flex flex-col items-center relative animate-in fade-in zoom-in-95 duration-200">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 text-xs text-slate-400 hover:text-white flex items-center gap-1.5 font-mono transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Top Shield Icon matching Figma */}
        <div className="w-14 h-14 rounded-2xl bg-[#0F172A] border border-[#1E293B] flex items-center justify-center text-[#00D084] shadow-lg mb-4 mt-2">
          <Shield className="w-7 h-7" />
        </div>

        {/* Titles */}
        <h2 className="text-2xl font-black text-white text-center">
          Sign In to STRATA
        </h2>
        <p className="text-[11px] font-mono text-[#00D084] uppercase tracking-widest mt-1 mb-6">
          BHU-AADHAAR VOLUMETRIC PORTAL
        </p>

        {/* Form Fields */}
        <div className="w-full space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Aadhaar Number or Email Address
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="9872 5431 0092"
              className="w-full px-4 py-3 rounded-xl bg-[#0F172A] border border-[#1E293B] text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-[#00D084] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#0F172A] border border-[#1E293B] text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-[#00D084] transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 2FA Toggle and Forgot Password matching Figma */}
          <div className="flex items-center justify-between py-1">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={is2FAEnabled}
                onChange={(e) => setIs2FAEnabled(e.target.checked)}
                className="w-4 h-4 rounded border-[#1E293B] accent-[#00D084]"
              />
              <span>Aadhaar 2FA OTP</span>
            </label>
            <button
              type="button"
              className="text-xs text-slate-400 hover:text-[#00D084] transition-colors"
            >
              Forgot Password?
            </button>
          </div>

          {/* Primary Action: SIGN IN WITH DIGILOCKER matching Figma */}
          <button
            onClick={() => handleSignIn('DIGILOCKER')}
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-[#00D084] hover:bg-[#00b875] text-[#080E17] font-black text-xs font-mono tracking-wider transition-all shadow-[0_0_20px_rgba(0,208,132,0.3)] cursor-pointer flex items-center justify-center gap-2"
          >
            {isSubmitting ? 'AUTHENTICATING...' : 'SIGN IN WITH DIGILOCKER'}
          </button>

          {/* Secondary Action: USE GOVERNMENT eKYC matching Figma */}
          <button
            onClick={() => handleSignIn('EKYC')}
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] border border-[#1E293B] text-slate-200 font-bold text-xs font-mono tracking-wider transition-all cursor-pointer"
          >
            USE GOVERNMENT eKYC
          </button>
        </div>

        {/* Footer Link matching Figma */}
        <p className="text-xs text-slate-400 mt-6">
          Don't have an account?{' '}
          <span
            onClick={() => handleSignIn('REGISTER')}
            className="text-[#00D084] font-semibold cursor-pointer hover:underline"
          >
            Register New Account
          </span>
        </p>
      </div>
    </div>
  )
}
