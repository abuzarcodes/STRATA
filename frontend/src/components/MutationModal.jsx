import React, { useState } from 'react'
import {
  ArrowRightLeft,
  UserCheck,
  CheckCircle2,
  FileText,
  X,
  Sparkles
} from 'lucide-react'
import confetti from 'canvas-confetti'

export default function MutationModal({
  unit,
  onClose,
  onApplyMutation
}) {
  const [newOwner, setNewOwner] = useState('Sunil Narang')
  const [aadhaarMasked, setAadhaarMasked] = useState('XXXX-XXXX-8921')
  const [subRegistrarNote, setSubRegistrarNote] = useState('Sale Deed Registered: Book 1, Vol 492, Page 112')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-lg glass-panel-accent rounded-3xl p-6 shadow-2xl border border-emerald-500/30 flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ArrowRightLeft className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Cadastral Mutation Engine
              </div>
              <h2 className="text-xl font-extrabold text-white">
                Transfer of Ownership & Title Mutation
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!success ? (
          <form onSubmit={handleExecuteMutation} className="space-y-4 my-4">
            {/* Unit Info Box */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1 text-xs">
              <div className="text-slate-400 font-mono text-[11px]">3D-ULPIN: <strong className="text-[#00D084]">{unit.ulpin_3d}</strong></div>
              <div className="font-bold text-slate-200 text-sm">{unit.name}</div>
              <div className="text-slate-400 text-xs">Current Registered Owner: <strong className="text-slate-200">{unit.owner}</strong></div>
            </div>

            {/* Input: New Owner Name */}
            <div className="space-y-1.5">
              <label htmlFor="new-owner-name-input" className="text-xs font-semibold text-slate-300">
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
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white font-medium focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Input: Aadhaar Masked */}
            <div className="space-y-1.5">
              <label htmlFor="purchaser-aadhaar-input" className="text-xs font-semibold text-slate-300">
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
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Input: Sub-Registrar Note */}
            <div className="space-y-1.5">
              <label htmlFor="sub-registrar-note-input" className="text-xs font-semibold text-slate-300">
                Sub-Registrar Registration Deed Reference:
              </label>
              <input
                id="sub-registrar-note-input"
                name="subRegistrarNote"
                type="text"
                aria-label="Sub Registrar Registration Deed Reference"
                value={subRegistrarNote}
                onChange={(e) => setSubRegistrarNote(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-400 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Form Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isSubmitting ? 'Mutating 3D Title...' : 'Approve & Sanction Mutation'}</span>
              </button>
            </div>
          </form>
        ) : (
          /* Success Screen */
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Mutation Complete & 3D Title Transferred!
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                Property <strong>{unit.ulpin_3d}</strong> is now legally registered under <strong>{newOwner}</strong>.
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
            >
              Close Window
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
