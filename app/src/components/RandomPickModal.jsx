import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Dices, MapPin, Star, ArrowRight, RotateCw, Sparkles } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function RandomPickModal({ onClose }) {
  const { filteredRestaurants } = useApp()
  const navigate = useNavigate()
  const [picked, setPicked] = useState(null)
  const [phase, setPhase] = useState('spinning') // 'spinning' | 'revealing' | 'done'
  const [flashItems, setFlashItems] = useState([])
  const [flashIdx, setFlashIdx] = useState(0)

  const pick = useCallback(() => {
    if (filteredRestaurants.length === 0) return
    setPhase('spinning')
    setPicked(null)

    // Flash through random restaurants rapidly
    const shuffled = [...filteredRestaurants].sort(() => Math.random() - 0.5)
    setFlashItems(shuffled.slice(0, Math.min(12, shuffled.length)))
    setFlashIdx(0)

    // Final pick
    const final = filteredRestaurants[Math.floor(Math.random() * filteredRestaurants.length)]

    // After flashing, reveal
    setTimeout(() => {
      setPhase('revealing')
      setPicked(final)
      setTimeout(() => setPhase('done'), 400)
    }, 1800)
  }, [filteredRestaurants])

  // Flash animation
  useEffect(() => {
    if (phase !== 'spinning' || flashItems.length === 0) return
    const interval = setInterval(() => {
      setFlashIdx(prev => (prev + 1) % flashItems.length)
    }, 120)
    return () => clearInterval(interval)
  }, [phase, flashItems])

  useEffect(() => { pick() }, [])

  const goToDetail = () => {
    if (picked) {
      onClose()
      navigate(`/restaurant/${picked.id}`)
    }
  }

  const currentFlash = flashItems[flashIdx]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

      <div
        className="relative w-full max-w-[400px] overflow-hidden"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'modal-pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        {/* Close button - floating */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-full text-white/80 hover:text-white hover:bg-black/50 cursor-pointer transition-all"
          aria-label="关闭"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Main card */}
        <div className="rounded-3xl overflow-hidden shadow-2xl shadow-black/30">
          {/* Image area - full bleed */}
          <div className="relative h-[260px] overflow-hidden">
            {/* Spinning state: flash through images */}
            {phase === 'spinning' && currentFlash && (
              <img
                key={flashIdx}
                src={currentFlash.cover}
                alt=""
                className="w-full h-full object-cover"
                style={{ animation: 'flash-in 0.1s ease-out' }}
              />
            )}

            {/* Revealed state */}
            {phase !== 'spinning' && picked && (
              <img
                src={picked.cover}
                alt={picked.name}
                className="w-full h-full object-cover"
                style={{ animation: phase === 'revealing' ? 'reveal-zoom 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards' : undefined }}
              />
            )}

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

            {/* Top: dice icon + title */}
            <div className="absolute top-5 left-5 flex items-center gap-2.5">
              <div className={`w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center ${phase === 'spinning' ? 'animate-spin' : ''}`}
                style={phase === 'spinning' ? { animationDuration: '0.6s' } : undefined}
              >
                <Dices className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg leading-tight">
                  {phase === 'spinning' ? '正在抽签...' : '今天就吃这家！'}
                </h2>
                <p className="text-white/60 text-xs mt-0.5">
                  {phase === 'spinning' ? '命运之轮转动中' : '让我们一起去尝尝吧'}
                </p>
              </div>
            </div>

            {/* Bottom: restaurant name overlay (only when done) */}
            {phase !== 'spinning' && picked && (
              <div className="absolute bottom-4 left-5 right-5" style={{ animation: 'slide-up 0.4s ease-out 0.1s both' }}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-amber-400 text-xs font-semibold tracking-wide uppercase">命运之选</span>
                </div>
                <h3 className="text-white font-bold text-2xl">{picked.name}</h3>
              </div>
            )}

            {/* Spinning name flash */}
            {phase === 'spinning' && currentFlash && (
              <div className="absolute bottom-4 left-5 right-5">
                <h3 className="text-white/60 font-bold text-2xl truncate">{currentFlash.name}</h3>
              </div>
            )}
          </div>

          {/* Info area */}
          <div className="bg-white p-5">
            {phase !== 'spinning' && picked ? (
              <div style={{ animation: 'slide-up 0.4s ease-out 0.2s both' }}>
                {/* Rating + Price row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="font-bold text-text">{picked.rating}</span>
                      <span className="text-xs text-text-muted">({picked.ratingCount}条)</span>
                    </div>
                    <span className="w-px h-4 bg-stone-200" />
                    <span className="text-sm text-text-secondary">{picked.cuisine}</span>
                  </div>
                  <span className="text-lg font-bold text-primary">¥{picked.avgPrice}<span className="text-xs font-normal text-text-muted">/人</span></span>
                </div>

                {/* Address */}
                <div className="flex items-center gap-1.5 mt-3 text-sm text-text-muted">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{picked.address}</span>
                </div>

                {/* Tags */}
                <div className="flex gap-1.5 mt-3">
                  {picked.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 rounded-full bg-primary/8 text-primary/80 font-medium">{tag}</span>
                  ))}
                </div>
              </div>
            ) : (
              /* Spinning placeholder */
              <div className="space-y-3">
                <div className="h-5 w-2/3 rounded-lg bg-stone-100 animate-pulse" />
                <div className="h-4 w-1/2 rounded-lg bg-stone-100 animate-pulse" />
                <div className="flex gap-2">
                  <div className="h-6 w-16 rounded-full bg-stone-100 animate-pulse" />
                  <div className="h-6 w-16 rounded-full bg-stone-100 animate-pulse" />
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 mt-5">
              <button
                onClick={pick}
                disabled={phase === 'spinning' || filteredRestaurants.length === 0}
                className="flex-1 py-3 rounded-2xl border-2 border-stone-200 text-text-secondary font-semibold text-sm hover:border-primary hover:text-primary disabled:opacity-40 cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                <RotateCw className={`w-4 h-4 ${phase === 'spinning' ? 'animate-spin' : ''}`} />
                换一个
              </button>
              <button
                onClick={goToDetail}
                disabled={!picked || phase === 'spinning'}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm disabled:opacity-40 cursor-pointer transition-all hover:shadow-lg hover:shadow-primary/25 flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                就这家
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modal-pop {
          0% { opacity: 0; transform: scale(0.85) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes flash-in {
          0% { opacity: 0.3; }
          100% { opacity: 1; }
        }
        @keyframes reveal-zoom {
          0% { transform: scale(1.15); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes slide-up {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
