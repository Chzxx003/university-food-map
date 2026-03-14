import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Flame, Star, TrendingUp, Crown, Medal, Trophy } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { RankSkeleton } from '../components/Skeleton'

const tabs = [
  { id: 'hot', label: '本周热门', icon: Flame, color: 'text-orange-500' },
  { id: 'rating', label: '高分好评', icon: Star, color: 'text-accent' },
  { id: 'value', label: '高性价比', icon: TrendingUp, color: 'text-green-500' },
]

const rankBadge = (index) => {
  if (index === 0) return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-sm">
      <Crown className="w-4.5 h-4.5 text-white fill-white" />
    </div>
  )
  if (index === 1) return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-stone-300 to-stone-400 flex items-center justify-center shadow-sm">
      <Medal className="w-4.5 h-4.5 text-white fill-white" />
    </div>
  )
  if (index === 2) return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 to-orange-700 flex items-center justify-center shadow-sm">
      <Medal className="w-4.5 h-4.5 text-white fill-white" />
    </div>
  )
  return <span className="w-8 h-8 flex items-center justify-center text-sm font-bold text-text-muted">{index + 1}</span>
}

export default function RankingsPage() {
  const [activeTab, setActiveTab] = useState('hot')
  const { allRestaurants } = useApp()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const ranked = useMemo(() => {
    const list = [...allRestaurants]
    switch (activeTab) {
      case 'hot': return list.sort((a, b) => b.visits - a.visits)
      case 'rating': return list.sort((a, b) => b.rating - a.rating)
      case 'value': return list.sort((a, b) => (b.rating / b.avgPrice) - (a.rating / a.avgPrice))
      default: return list
    }
  }, [activeTab, allRestaurants])

  return (
    <div className="pb-24 md:pb-8">
      {/* Glass banner */}
      <div className="relative overflow-hidden rounded-b-[2rem] mb-4">
        <div className="absolute top-[-60px] right-[-30px] w-64 h-64 bg-gradient-to-br from-amber-400/30 to-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-40px] left-[-20px] w-48 h-48 bg-gradient-to-br from-primary/25 to-secondary/15 rounded-full blur-3xl" />
        <div className="glass relative px-4 pt-6 pb-6">
          <h1 className="text-2xl font-bold text-text flex items-center gap-2">
            <Trophy className="w-7 h-7 text-primary" /> 排行榜
          </h1>
          <p className="text-sm text-text-secondary mt-1">大学城最受欢迎的餐厅都在这里</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 px-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'glass-strong shadow-sm'
                : 'glass-subtle text-text-secondary'
            }`}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? tab.color : ''}`} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? <div className="px-4"><RankSkeleton /></div> : (
        <div className="space-y-3 px-4">
          {ranked.slice(0, 10).map((r, idx) => (
            <div key={r.id} className="card-animate" style={{ animationDelay: `${idx * 60}ms` }}>
              <div
                onClick={() => navigate(`/restaurant/${r.id}`)}
                className={`flex items-center gap-4 p-4 rounded-3xl transition-all cursor-pointer hover:shadow-md ${
                  idx < 3 ? 'glass-accent' : 'glass'
                }`}
              >
                <div className="flex-shrink-0">{rankBadge(idx)}</div>
                <img src={r.cover} alt={r.name} className={`rounded-2xl object-cover flex-shrink-0 ${idx < 3 ? 'w-20 h-20' : 'w-16 h-16'}`} loading="lazy" />
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold text-text truncate ${idx < 3 ? 'text-base' : ''}`}>{r.name}</h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-text-secondary">
                    <span className="px-1.5 py-0.5 glass-subtle rounded-lg">{r.cuisine}</span>
                    <span>¥{r.avgPrice}/人</span>
                  </div>
                  <div className="flex gap-1 mt-1">
                    {r.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-xs px-1.5 py-0.5 glass-accent text-primary/80 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  {activeTab === 'hot' ? (
                    <>
                      <div className="flex items-center gap-1">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span className={`font-bold text-text ${idx < 3 ? 'text-lg' : ''}`}>{r.visits}</span>
                      </div>
                      <p className="text-xs text-text-muted mt-0.5">次访问</p>
                    </>
                  ) : activeTab === 'rating' ? (
                    <>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-accent fill-accent" />
                        <span className={`font-bold text-text ${idx < 3 ? 'text-lg' : ''}`}>{r.rating}</span>
                      </div>
                      <p className="text-xs text-text-muted mt-0.5">{r.ratingCount} 条评价</p>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-accent fill-accent" />
                        <span className={`font-bold text-text ${idx < 3 ? 'text-lg' : ''}`}>{r.rating}</span>
                      </div>
                      <p className="text-xs text-green-600 font-medium mt-0.5">仅 ¥{r.avgPrice}/人</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
