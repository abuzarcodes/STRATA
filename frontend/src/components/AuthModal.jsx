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
    accentColor: 'var(--color-accent-primary)'
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
    accentColor: 'var(--color-status-info)'
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
    accentColor: 'var(--color-status-warning)'
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
        isLight ? 'bg-[var(--color-surface-muted)]/85' : 'bg-[var(--color-surface-3)]/90'
      }`}
    >
      <div
        className={`w-full max-w-md rounded-3xl border shadow-2xl p-8 relative overflow-hidden backdrop-blur-2xl transition-all duration-300 ${
          isLight
            ? 'bg-white/95 border-[var(--color-border-default)] text-slate-800 shadow-[0_20px_50px_rgba(27,94,32,0.15)]'
            : 'bg-[var(--color-surface-1)]/95 border-[var(--color-border-default)] text-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.8)]'
        }`}
      >
        {/* Top Glow Bar matching Role Theme */}
        <div
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{ backgroundColor: config.accentColor }}
        />

        {/* Header with Role Title and Back Button */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className={`p-2 rounded-xl border flex items-center gap-1.5 text-xs font-mono font-bold transition-all cursor-pointer ${
              isLight
                ? 'bg-white border-[var(--color-border-default)] text-slate-600 hover:text-[var(--color-accent-primary)] hover:bg-[var(--color-surface-muted)]'
                : 'bg-[var(--color-surface-2)] border-[var(--color-border-default)] text-slate-400 hover:text-white hover:border-[var(--color-accent-primary)]'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Switch Role</span>
          </button>

          <span
            className="text-[10px] font-mono font-black tracking-wider px-3 py-1 rounded-full border shadow-sm"
            style={{
              borderColor: `${config.accentColor}50`,
              color: config.accentColor,
              backgroundColor: `${config.accentColor}15`
            }}
          >
            {config.badge}
          </span>
        </div>

        {/* Role Icon & Title */}
        <div className="flex items-center gap-3.5 mb-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center border shadow-inner"
            style={{
              backgroundColor: `${config.accentColor}20`,
              borderColor: `${config.accentColor}40`
            }}
          >
            <RoleIcon className="w-6 h-6" style={{ color: config.accentColor }} />
          </div>
          <div>
            <h2 className={`text-lg font-black tracking-tight ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-white'}`}>
              {config.title}
            </h2>
            <p className="text-xs text-slate-500 font-mono">
              National Cadastral Authentication Gateway
            </p>
          </div>
        </div>

        {/* Helper Hint */}
        <div
          className={`p-3 rounded-2xl border text-xs leading-relaxed mb-6 ${
            isLight
              ? 'bg-[var(--color-surface-2)] border-[var(--color-border-default)] text-slate-600'
              : 'bg-[var(--color-surface-3)] border-[var(--color-border-default)] text-slate-300'
          }`}
        >
          {config.hint}
        </div>

        {/* Quick Demo Pre-Fill Button */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
            Sign In Details
          </span>
          <button
            onClick={handleFillDemo}
            type="button"
            className={`text-[11px] font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer ${
              isLight ? 'text-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary-hover)]' : 'text-[var(--color-accent-primary)] hover:underline'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Auto-fill Demo Details</span>
          </button>
        </div>

        {/* Auth Form */}
        <div className="space-y-4">
          <div>
            <label className={`block text-xs font-mono font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              {config.idLabel}
            </label>
            <div className="relative">
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={config.idPlaceholder}
                className={`w-full px-4 py-2.5 rounded-xl border text-xs font-mono transition-all focus:outline-none ${
                  isLight
                    ? 'bg-white border-[var(--color-border-default)] text-slate-800 focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)]'
                    : 'bg-[var(--color-surface-3)] border-[var(--color-border-default)] text-white focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)]'
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-xs font-mono font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Access PIN / Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className={`w-full px-4 py-2.5 rounded-xl border text-xs font-mono transition-all focus:outline-none ${
                  isLight
                    ? 'bg-white border-[var(--color-border-default)] text-slate-800 focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)]'
                    : 'bg-[var(--color-surface-3)] border-[var(--color-border-default)] text-white focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)]'
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
                className="w-4 h-4 rounded accent-[var(--color-accent-primary)]"
              />
              <span>Cryptographic 2FA e-KYC Verification</span>
            </label>
            <span className={`text-[10px] font-mono font-bold ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-[var(--color-accent-primary)]'}`}>ACTIVE</span>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => handleSignIn('PRIMARY')}
            disabled={isSubmitting}
            className={`w-full py-3 rounded-xl font-black text-xs font-mono tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg ${
              isLight
                ? 'bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary-hover)] text-white shadow-[var(--color-accent-primary)]/20'
                : 'bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary-hover)] text-[var(--color-surface-3)] shadow-[0_0_20px_rgba(0,208,132,0.3)]'
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
                ? 'bg-[var(--color-surface-3)] hover:bg-[var(--color-surface-muted)] border-[var(--color-border-default)] text-[var(--color-accent-primary)]'
                : 'bg-[var(--color-surface-2)] hover:bg-[var(--color-border-default)] border-[var(--color-border-default)] text-slate-200'
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
