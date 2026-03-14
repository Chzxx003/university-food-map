import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Shuffle, MapPin, Star, ArrowRight, Utensils } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function RandomPickModal({ onClose }) {
  const { filteredRestaurants } = useApp()
  const navigate = useNavigate()
  const [picked, setPicked] = useState(null)
  const [spinning, setSpinning] = useState(false)
  const [slotItems, setSlotItems] = useState([])
  const slotRef = useRef(null)

  const pick = () => {
    if (filteredRestaurants.length === 0) return
    setSpinning(true)

    // Build a random sequence of restaurants for the slot animation
    const items = []
    for (let i = 0; i < 16; i++) {
      items.push(filteredRestaurants[Math.floor(Math.random() * filteredRestaurants.length)])
    }
    // Final pick
    const final = filteredRestaurants[Math.floor(Math.random() * filteredRestaurants.length)]
    items.push(final)
    setSlotItems(items)

    // Animate slot: scroll to final item
    setTimeout(() => {
      if (slotRef.current) {
        slotRef.current.style.transition = 'transform 2s cubic-bezier(0.15, 0.85, 0.35, 1)'
        slotRef.current.style.transform = `translateY(-${(items.length - 1) * 72}px)`
      }
    }, 50)

    // Reveal final pick after animation
    setTimeout(() => {
      setPicked(final)
      setSpinning(false)
      setSlotItems([])
      if (slotRef.current) {
        slotRef.current.style.transition = 'none'
        slotRef.current.style.transform = 'translateY(0)'
      }
    }, 2200)
  }

  useEffect(() => { pick() }, [])

  const goToDetail = () => {
    if (picked) {
      onClose()
      navigate(`/restaurant/${picked.id}`)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="glass-strong rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'toast-in 0.3s ease-out' }}
      >
        <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white text-center relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-lg cursor-pointer transition-colors" aria-label="关闭">
            <X className="w-5 h-5" />
          </button>
          <Shuffle className="w-10 h-10 mx-auto mb-2" />
          <h2 className="text-xl font-bold">今天吃什么？</h2>
          <p className="text-sm text-white/80 mt-1">让命运帮你做选择</p>
        </div>

        <div className="p-6">
          {/* Slot machine animation */}
          {spinning && slotItems.length > 0 && (
            <div className="h-[72px] overflow-hidden glass rounded-2xl mb-4">
              <div ref={slotRef} style={{ transform: 'translateY(0)' }}>
                {slotItems.map((r, i) => (
                  <div key={i} className="h-[72px] flex items-center gap-3 px-3">
                    <img src={r.cover} alt={r.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-text truncate">{r.name}</p>
                      <p className="text-xs text-text-muted">{r.cuisine} · ¥{r.avgPrice}/人</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Result display */}
          {!spinning && picked && (
            <div className="transition-all duration-300 opacity-100 scale-100">
              <div className="rounded-xl overflow-hidden mb-4">
                <img src={picked.cover} alt={picked.name} className="w-full h-40 object-cover" />
              </div>
              <h3 className="text-lg font-bold text-text">{picked.name}</h3>
              <div className="flex items-center gap-3 mt-2 text-sm text-text-secondary">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-accent fill-accent" />
                  {picked.rating}
                </span>
                <span>人均 ¥{picked.avgPrice}</span>
                <span className="text-xs px-2 py-0.5 glass-accent rounded-full text-primary">{picked.cuisine}</span>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-text-muted">
                <MapPin className="w-3.5 h-3.5" />
                {picked.address}
              </div>
            </div>
          )}

          {!spinning && !picked && filteredRestaurants.length === 0 && (
            <div className="text-center py-8">
              <Utensils className="w-10 h-10 text-stone-300 mx-auto mb-3" />
              <p className="text-text-muted">当前筛选条件下没有餐厅</p>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button
              onClick={pick}
              disabled={spinning || filteredRestaurants.length === 0}
              className="flex-1 py-3 glass-accent rounded-2xl border-2 border-primary text-primary font-medium hover:bg-primary/5 disabled:opacity-50 cursor-pointer transition-colors"
            >
              换一个
            </button>
            <button
              onClick={goToDetail}
              disabled={!picked || spinning}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-medium disabled:opacity-50 cursor-pointer transition-colors flex items-center justify-center gap-2"
            >
              就这家 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
