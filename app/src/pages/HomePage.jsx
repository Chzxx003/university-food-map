import { useState, useEffect } from 'react'
import { Map as MapIcon, Dices, ChevronRight } from 'lucide-react'
import { useApp } from '../context/AppContext'
import SchoolTabs from '../components/SchoolTabs'
import SearchBar from '../components/SearchBar'
import FilterBar from '../components/FilterBar'
import RestaurantCard from '../components/RestaurantCard'
import MagazineHero from '../components/MagazineHero'
import MapView from '../components/MapView'
import RandomPickModal from '../components/RandomPickModal'
import { MagazineHeroSkeleton, ListItemSkeleton } from '../components/Skeleton'

const sceneShortcuts = [
  { key: '外卖友好', emoji: '🛵', label: '外卖' },
  { key: '一人食', emoji: '🍜', label: '一人食' },
  { key: '宵夜', emoji: '🌙', label: '宵夜' },
  { key: '自习续杯', emoji: '📚', label: '自习' },
  { key: '约会', emoji: '💑', label: '约会' },
  { key: '学生套餐', emoji: '💰', label: '套餐' },
  { key: '聚餐', emoji: '🎉', label: '聚餐' },
]

const sortOptions = [
  { key: 'default', label: '综合' },
  { key: 'rating', label: '评分' },
  { key: 'price', label: '价格' },
  { key: 'distance', label: '距离' },
]

export default function HomePage() {
  const {
    filteredRestaurants, heroRestaurants, listRestaurants,
    sortBy, setSortBy, selectedSchool,
    selectedScene, setSelectedScene,
  } = useApp()
  const [showMap, setShowMap] = useState(true)
  const [showRandom, setShowRandom] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="pb-24 md:pb-8">
      {/* Desktop: content left + sticky map right, full viewport */}
      <div className="lg:flex lg:items-start lg:h-[calc(100vh-64px)]">

        {/* ── Left column ── */}
        <div className="lg:flex-1 lg:overflow-y-auto lg:h-full">
          {/* Hero area */}
          <div className="relative overflow-hidden rounded-b-[2rem]">
            <div className="absolute top-[-60px] right-[-40px] w-72 h-72 bg-gradient-to-br from-primary/30 to-secondary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-[-40px] left-[-30px] w-56 h-56 bg-gradient-to-br from-primary/30 to-secondary/20 rounded-full blur-3xl" />
            <div className="glass relative px-4 pt-6 pb-6 space-y-4">
              <div className="relative">
                <h1 className="text-2xl sm:text-3xl font-bold text-text">
                  发现大学城好味道 🍜
                </h1>
                <p className="text-sm text-text-secondary mt-1">找到你身边最好吃的那家店</p>
              </div>
              <SchoolTabs />
              <SearchBar />
            </div>
          </div>

          <div className="px-4 pt-4">
            <FilterBar />
          </div>

          {/* Scene shortcuts */}
          <div className="px-4 mt-3 overflow-x-auto scrollbar-none">
            <div className="flex gap-3">
              {sceneShortcuts.map(s => (
                <button
                  key={s.key}
                  onClick={() => setSelectedScene(selectedScene === s.key ? '全部' : s.key)}
                  className={`flex flex-col items-center gap-1 cursor-pointer transition-all flex-shrink-0 ${
                    selectedScene === s.key ? 'scale-105' : ''
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all ${
                    selectedScene === s.key
                      ? 'glass-accent shadow-sm ring-2 ring-primary/30'
                      : 'glass hover:shadow-sm'
                  }`}>
                    {s.emoji}
                  </div>
                  <span className={`text-xs transition-colors ${
                    selectedScene === s.key ? 'text-primary font-semibold' : 'text-text-muted'
                  }`}>{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Magazine Hero */}
          <div className="px-4 mt-4">
            {loading ? (
              <MagazineHeroSkeleton />
            ) : heroRestaurants.length >= 2 ? (
              <div className="card-animate">
                <MagazineHero heroRestaurants={heroRestaurants} />
              </div>
            ) : null}
          </div>

          {/* Sort bar */}
          <div className="px-4 mt-4">
            <div className="glass-strong rounded-2xl px-3 py-2.5 flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-text whitespace-nowrap">
                附近 <span className="text-primary">{listRestaurants.length}</span> 家
              </span>
              <div className="flex items-center gap-1">
                {sortOptions
                  .filter(o => o.key !== 'distance' || selectedSchool.id !== 'all')
                  .map(o => (
                    <button
                      key={o.key}
                      onClick={() => setSortBy(o.key)}
                      className={`text-xs px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        sortBy === o.key
                          ? 'glass-accent text-primary font-semibold'
                          : 'text-text-secondary hover:text-text'
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                {/* Map toggle: mobile only */}
                <button
                  onClick={() => setShowMap(!showMap)}
                  className={`lg:hidden flex items-center gap-0.5 text-xs px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    showMap ? 'glass-accent text-primary font-semibold' : 'text-text-secondary hover:text-text'
                  }`}
                >
                  <MapIcon className="w-3.5 h-3.5" />
                  地图
                </button>
              </div>
            </div>
          </div>

          {/* Random pick banner */}
          {!loading && filteredRestaurants.length > 0 && (
            <div className="px-4 mt-3">
              <button
                onClick={() => setShowRandom(true)}
                className="w-full glass-accent rounded-2xl px-4 py-3 flex items-center gap-3 cursor-pointer group hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Dices className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-text">选择困难症？</p>
                  <p className="text-xs text-text-muted">帮你随机挑一家，告别纠结</p>
                </div>
                <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}

          {/* Mobile map (toggled) */}
          {showMap && (
            <div className="px-4 mt-3 lg:hidden">
              <MapView className="h-[350px]" />
            </div>
          )}

          {/* Restaurant list */}
          <div className="px-4 mt-3 space-y-2">
            {loading ? (
              Array.from({ length: 6 }, (_, i) => <ListItemSkeleton key={i} />)
            ) : listRestaurants.length === 0 && heroRestaurants.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full glass-accent flex items-center justify-center">
                  <MapIcon className="w-8 h-8 text-primary/40" />
                </div>
                <p className="text-text-secondary font-medium">没有找到符合条件的餐厅</p>
                <p className="text-sm text-text-muted mt-1">试试调整筛选条件吧</p>
              </div>
            ) : (
              listRestaurants.map((r, i) => (
                <div key={r.id} className="card-animate" style={{ animationDelay: `${i * 50}ms` }}>
                  <RestaurantCard restaurant={r} mini />
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── Right column: map panel (desktop only) ── */}
        <div className="hidden lg:flex flex-col w-[420px] flex-shrink-0 h-full border-l border-border/40">
          {/* Map header */}
          <div className="flex items-center gap-2 px-4 py-3 glass-strong border-b border-border/30">
            <MapIcon className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-text">附近餐厅</span>
            <span className="ml-auto text-xs text-text-muted">{filteredRestaurants.length} 家</span>
          </div>
          {/* Map */}
          <div className="flex-1 relative">
            <MapView className="absolute inset-0 rounded-none" />
          </div>
        </div>
      </div>

      {showRandom && <RandomPickModal onClose={() => setShowRandom(false)} />}
    </div>
  )
}
