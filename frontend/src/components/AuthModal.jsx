import React, { useState, useEffect } from 'react'
import { ArrowLeft, Shield, Eye, EyeOff, CheckCircle2, KeyRound, Sparkles, User, Lock, Crosshair, Scale, Compass } from 'lucide-react'

const ROLE_PRESETS = {
  CITIZEN: {
    title: 'Public Citizen Access',
    badge: 'FREE PUBLIC CADASTRE',
    idLabel: 'Aadhaar Number or Mobile No.',
    idPlaceholder: '9872 5431 0092',
    demoId: '9872 5431 0092',
    demoPass: 'citizen@delhi2026',
    submitText: 'PROCEED AS PUBLIC EXPLORER',
    secondaryText: 'VERIFY VIA AADHAAR OTP',
    hint: 'Public Citizen access lets you search parcels, inspect 3D property deeds, and view volumetric boundaries.',
    icon: Compass,
    accentColor: '#00D084'
  },
  OWNER: {
    title: 'Property Owner Vault',
    badge: 'DIGILOCKER / AADHAAR eKYC',
    idLabel: 'DigiLocker ID or Linked Aadhaar',
    idPlaceholder: 'DL-8849-2026-IN',
    demoId: 'DL-8849-2026-IN',
    demoPass: 'owner@strata2026',
    submitText: 'SIGN IN TO CITIZEN VAULT',
    secondaryText: 'DIGILOCKER FAST LOGIN',
    hint: 'Property Owner vault gives authenticated access to your registered 3D deeds, mutation requests, and tax records.',
    icon: Lock,
    accentColor: '#38BDF8'
  },
  SURVEYOR: {
    title: 'Licensed Cadastral Surveyor',
    badge: 'GOVT SURVEYOR LICENSE REQUIRED',
    idLabel: 'Surveyor Registration / License No.',
    idPlaceholder: 'SURV-DL-2026-088',
    demoId: 'SURV-DL-2026-088',
    demoPass: 'surveyor@strata2026',
    submitText: 'ACCESS INGESTION & CALIBRATION STUDIO',
    secondaryText: 'VALIDATE SURVEYOR CERTIFICATE',
    hint: 'Licensed Surveyor portal allows uploading CAD/BIM/LiDAR models, calibrating 3D vertices, and certifying watertightness.',
    icon: Crosshair,
    accentColor: '#A855F7'
  },
  GOVT: {
    title: 'Revenue Administrator & DILRMP',
    badge: 'AUTHORIZED REVENUE OFFICERS ONLY',
    idLabel: 'Government Officer Employee Code',
    idPlaceholder: 'REV-OFFICER-DL04-991',
    demoId: 'REV-OFFICER-DL04-991',
    demoPass: 'admin@revenue2026',
    submitText: 'AUTHORIZE REVENUE DASHBOARD',
    secondaryText: 'NIC e-SIGNATURE SIGN-IN',
    hint: 'Revenue Administrator portal enables setback encroachment auditing, AI ingestion sign-off, and mutation approval.',
    icon: Scale,
    accentColor: '#F59E0B'
  }
}

export default function AuthModal({ activeRole = 'CITIZEN', onBack, onSuccess, theme = 'CYBER' }) {
  const config = ROLE_PRESETS[activeRole] || ROLE_PRESETS.CITIZEN
  const RoleIcon = config.icon

  const [identifier, setIdentifier] = useState(config.demoId)
  const [password, setPassword] = useState(config.demoPass)
  const [showPassword, setShowPassword] = useState(false)
  const [is2FAEnabled, setIs2FAEnabled] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isLight = theme === 'LIGHT'

  // Update preset when role changes
  useEffect(() => {
    setIdentifier(config.demoId)
    setPassword(config.demoPass)
  }, [activeRole])

  const handleFillDemo = () => {
    setIdentifier(config.demoId)
    setPassword(config.demoPass)
  }

  const handleSignIn = (method = 'PRIMARY') => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      onSuccess({
        role: activeRole,
        identifier: identifier.trim() || config.demoId,
        method
      })
    }, 500)
  }

  return (
    <div
      className={`fixed inset-0 z-50 backdrop-blur-2xl flex items-center justify-center p-4 transition-colors duration-300 ${
        isLight ? 'bg-[#E8F5E9]/85' : 'bg-[#080E17]/90'
      }`}
    >
      <div
        className={`w-full max-w-lg rounded-3xl p-8 shadow-2xl flex flex-col items-center relative animate-in fade-in zoom-in-95 duration-200 border transition-all ${
          isLight
            ? 'bg-white border-[#C8E6C9] text-slate-800'
            : 'bg-[#0B131E] border-[#1E293B] text-white'
        }`}
      >
        {/* Back Button */}
        <button
          onClick={onBack}
          className={`absolute top-6 left-6 text-xs flex items-center gap-1.5 font-mono font-bold transition-colors cursor-pointer ${
            isLight ? 'text-slate-500 hover:text-[#1B5E20]' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>CHANGE ROLE</span>
        </button>

        {/* Top Role Badge */}
        <div className="flex flex-col items-center mt-2 mb-4">
          <div
            className={`w-14 h-14 rounded-2xl border flex items-center justify-center shadow-lg mb-3 ${
              isLight
                ? 'bg-[#E8F5E9] border-[#C8E6C9] text-[#1B5E20]'
                : 'bg-[#0F172A] border-[#1E293B] text-[#00D084]'
            }`}
          >
            <RoleIcon className="w-7 h-7" style={{ color: config.accentColor }} />
          </div>

          <span
            className={`text-[10px] font-mono font-bold px-3 py-0.5 rounded-full border mb-1 ${
              isLight ? 'bg-[#F1F8E9] border-[#C8E6C9] text-[#1B5E20]' : 'bg-[#0F172A] border-[#1E293B] text-[#00D084]'
            }`}
          >
            {config.badge}
          </span>

          <h2 className={`text-2xl font-black text-center ${isLight ? 'text-[#1B5E20]' : 'text-white'}`}>
            {config.title}
          </h2>
          <p className="text-xs text-slate-500 text-center max-w-sm mt-1">
            {config.hint}
          </p>
        </div>

        {/* Demo Auto-fill Pill Button */}
        <div className="w-full flex items-center justify-between px-1 mb-4">
          <span className="text-[11px] font-mono text-slate-400">Preset Credentials:</span>
          <button
            type="button"
            onClick={handleFillDemo}
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isLight
                ? 'bg-[#E8F5E9] border-[#C8E6C9] text-[#1B5E20] hover:bg-[#C8E6C9]'
                : 'bg-[#00D084]/15 border-[#00D084]/30 text-[#00D084] hover:bg-[#00D084]/25'
            }`}
          >
            <KeyRound className="w-3 h-3" />
            <span>Auto-fill Demo Details</span>
          </button>
        </div>

        {/* Form Fields */}
        <div className="w-full space-y-3.5">
          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              {config.idLabel}
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={config.idPlaceholder}
              className={`w-full px-4 py-2.5 rounded-xl border text-xs font-mono transition-all focus:outline-none ${
                isLight
                  ? 'bg-[#F9FBF9] border-[#C8E6C9] text-slate-800 placeholder-slate-400 focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20]'
                  : 'bg-[#0F172A] border-[#1E293B] text-white placeholder-slate-500 focus:border-[#00D084] focus:ring-1 focus:ring-[#00D084]'
              }`}
            />
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Security Password / Passkey
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border text-xs font-mono transition-all focus:outline-none pr-10 ${
                  isLight
                    ? 'bg-[#F9FBF9] border-[#C8E6C9] text-slate-800 placeholder-slate-400 focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20]'
                    : 'bg-[#0F172A] border-[#1E293B] text-white placeholder-slate-500 focus:border-[#00D084] focus:ring-1 focus:ring-[#00D084]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 2FA Toggle */}
          <div className="flex items-center justify-between py-0.5">
            <label className={`flex items-center gap-2 text-xs cursor-pointer ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              <input
                type="checkbox"
                checked={is2FAEnabled}
                onChange={(e) => setIs2FAEnabled(e.target.checked)}
                className="w-4 h-4 rounded accent-[#00D084]"
              />
              <span>Cryptographic 2FA e-KYC Verification</span>
            </label>
            <span className="text-[10px] font-mono text-[#00D084]">ACTIVE</span>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => handleSignIn('PRIMARY')}
            disabled={isSubmitting}
            className={`w-full py-3 rounded-xl font-black text-xs font-mono tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg ${
              isLight
                ? 'bg-[#1B5E20] hover:bg-[#2E7D32] text-white shadow-[#1B5E20]/20'
                : 'bg-[#00D084] hover:bg-[#00b875] text-[#080E17] shadow-[0_0_20px_rgba(0,208,132,0.3)]'
            }`}
          >
            {isSubmitting ? 'AUTHENTICATING TOKEN...' : config.submitText}
          </button>

          {/* Secondary Action */}
          <button
            onClick={() => handleSignIn('SECONDARY')}
            disabled={isSubmitting}
            className={`w-full py-2.5 rounded-xl border font-bold text-xs font-mono tracking-wider transition-all cursor-pointer ${
              isLight
                ? 'bg-[#F1F8E9] hover:bg-[#E8F5E9] border-[#C8E6C9] text-[#1B5E20]'
                : 'bg-[#0F172A] hover:bg-[#1E293B] border-[#1E293B] text-slate-200'
            }`}
          >
            {config.secondaryText}
          </button>
        </div>

        {/* Footer info */}
        <div className="mt-5 text-center text-[10px] font-mono text-slate-500">
          BHU-AADHAAR 3D • ISO 19152 LADM PART 2 SECURITY STANDARD
        </div>
      </div>
    </div>
  )
}
