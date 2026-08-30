import React, { useState } from 'react'
import {
  ArrowRightLeft,
  UserCheck,
  CheckCircle2,
  FileText,
  X,
  Sparkles,
  ShieldCheck,
  User
} from 'lucide-react'
import confetti from 'canvas-confetti'

export default function MutationModal({
  unit,
  onClose,
  onApplyMutation,
  theme = 'CYBER'
}) {
  const [newOwner, setNewOwner] = useState('Sunil Narang')
  const [aadhaarMasked, setAadhaarMasked] = useState('XXXX-XXXX-8921')
  const [subRegistrarNote, setSubRegistrarNote] = useState('Sale Deed Registered: Book 1, Vol 492, Page 112')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const isLight = theme === 'LIGHT'

  if (!unit) return null

  const handleExecuteMutation = (e) => {
    e.preventDefault()
    if (!newOwner.trim()) return

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSuccess(true)
      confetti({ particleCount: 70, spread: 60 })

      if (onApplyMutation) {
        onApplyMutation(unit.unit_id, newOwner.trim())
      }
    }, 800)
  }

  return (
    <div className={`responsive-modal-backdrop fixed inset-0 z-50 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-200 ${
      isLight ? 'bg-[var(--color-surface-muted)]/80' : 'bg-slate-950/80'
    }`}>
      <div className={`responsive-modal-panel w-full max-w-lg rounded-3xl p-6 shadow-2xl border flex flex-col justify-between transition-all ${
        isLight
          ? 'bg-white border-[var(--color-border-default)] text-slate-800'
          : 'bg-[var(--color-surface-1)] border-emerald-500/30 text-white'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between pb-4 border-b ${
          isLight ? 'border-[var(--color-border-default)]' : 'border-slate-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl border ${
              isLight ? 'bg-[var(--color-surface-muted)] text-[var(--color-accent-primary)] border-[var(--color-border-default)]' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            }`}>
              <ArrowRightLeft className="w-6 h-6" />
            </div>
            <div>
              <div className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-[var(--color-accent-primary-hover)]' : 'text-emerald-400'}`}>
                Cadastral Mutation Engine
              </div>
              <h2 className={`text-xl font-extrabold ${isLight ? 'text-slate-800' : 'text-white'}`}>
                Transfer of Ownership & Title Mutation
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!success ? (
          <form onSubmit={handleExecuteMutation} className="space-y-4 my-4">
            {/* Unit Info Box */}
            <div className={`p-3.5 rounded-2xl border space-y-1 text-xs ${
              isLight ? 'bg-[var(--color-surface-2)] border-[var(--color-border-default)]' : 'bg-slate-900/90 border-slate-800'
            }`}>
              <div className="text-slate-400 font-mono text-[11px]">3D-ULPIN: <strong className={isLight ? 'text-[var(--color-accent-primary)]' : 'text-[var(--color-accent-primary)]'}>{unit.ulpin_3d}</strong></div>
              <div className={`font-bold text-sm ${isLight ? 'text-slate-800' : 'text-white'}`}>{unit.name}</div>
              <div className="text-slate-500 text-xs">Current Registered Owner: <strong className={isLight ? 'text-slate-800' : 'text-slate-200'}>{unit.owner}</strong></div>
            </div>

            {/* Input: New Owner Name */}
            <div className="space-y-1.5">
              <label htmlFor="new-owner-name-input" className={`text-xs font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                New Purchaser / Legal Owner Name:
              </label>
              <input
                id="new-owner-name-input"
                name="newOwnerName"
                type="text"
                required
                aria-label="New Purchaser Legal Name"
                value={newOwner}
                onChange={(e) => setNewOwner(e.target.value)}
                placeholder="e.g. Sunil Narang"
                className={`w-full px-3 py-2 rounded-xl border text-sm font-medium focus:outline-none ${
                  isLight
                    ? 'bg-white border-[var(--color-border-default)] text-slate-800 focus:border-[var(--color-accent-primary)]'
                    : 'bg-slate-900 border-slate-700 text-white focus:border-emerald-500'
                }`}
              />
            </div>

            {/* Input: Aadhaar Masked */}
            <div className="space-y-1.5">
              <label htmlFor="purchaser-aadhaar-input" className={`text-xs font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Purchaser Aadhaar / PAN Verification:
              </label>
              <input
                id="purchaser-aadhaar-input"
                name="purchaserAadhaar"
                type="text"
                aria-label="Purchaser Aadhaar Verification"
                value={aadhaarMasked}
                onChange={(e) => setAadhaarMasked(e.target.value)}
                placeholder="XXXX-XXXX-8921"
                className={`w-full px-3 py-2 rounded-xl border text-xs font-mono focus:outline-none ${
                  isLight
                    ? 'bg-white border-[var(--color-border-default)] text-slate-800 focus:border-[var(--color-accent-primary)]'
                    : 'bg-slate-900 border-slate-700 text-slate-300 focus:border-emerald-500'
                }`}
              />
            </div>

            {/* Input: Sub-Registrar Note */}
            <div className="space-y-1.5">
              <label htmlFor="sub-registrar-note-input" className={`text-xs font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Sub-Registrar Registration Deed Reference:
              </label>
              <input
                id="sub-registrar-note-input"
                name="subRegistrarNote"
                type="text"
                aria-label="Sub Registrar Registration Deed Reference"
                value={subRegistrarNote}
                onChange={(e) => setSubRegistrarNote(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border text-xs font-mono focus:outline-none ${
                  isLight
                    ? 'bg-white border-[var(--color-border-default)] text-slate-800 focus:border-[var(--color-accent-primary)]'
                    : 'bg-slate-900 border-slate-700 text-slate-300 focus:border-emerald-500'
                }`}
              />
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 rounded-xl font-bold text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                  isLight
                    ? 'bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary-hover)] text-white shadow-[var(--color-accent-primary)]/20'
                    : 'bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary-hover)] text-[var(--color-bg-app)] shadow-[0_0_20px_rgba(0,208,132,0.3)]'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>{isSubmitting ? 'SIGNING TITLE ON LEDGER...' : 'CONFIRM TITLE MUTATION TRANSFER'}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="my-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[var(--color-accent-primary)]/20 border border-[var(--color-accent-primary)] text-[var(--color-accent-primary)] flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className={`text-lg font-bold ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-white'}`}>
              Title Mutation Successfully Registered
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Ownership of <strong>{unit.name}</strong> ({unit.ulpin_3d}) has been legally transferred to <strong>{newOwner}</strong>.
            </p>
            <div className="pt-4">
              <button
                onClick={onClose}
                className={`px-6 py-2.5 rounded-xl font-mono text-xs font-bold ${
                  isLight ? 'bg-[var(--color-accent-primary)] text-white' : 'bg-[var(--color-accent-primary)] text-[var(--color-bg-app)]'
                }`}
              >
                RETURN TO 3D DIGITAL TWIN
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
