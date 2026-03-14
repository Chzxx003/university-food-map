import { useState } from 'react'
import { SlidersHorizontal, ChevronDown, X } from 'lucide-react'
import { useApp } from '../context/AppContext'

const cuisineEmoji = {
  '川菜': '🌶️', '日料': '🍣', '韩料': '🍜', '西餐': '🍝', '快餐': '🍔',
  '小吃': '🥟', '甜品': '🍰', '烧烤': '🔥', '茶餐厅': '🍵', '粤菜': '🥡',
  '西北菜': '🍖', '饮品': '🧋',
}

export default function FilterBar() {
  const {
    cuisineTypes, selectedCuisine, setSelectedCuisine,
    sceneTypes, selectedScene, setSelectedScene,
    priceRanges, selectedPriceRange, setSelectedPriceRange,
    minRating, setMinRating,
    onlyOpen, setOnlyOpen,
  } = useApp()
  const [expanded, setExpanded] = useState(false)

  const hasFilters = selectedCuisine !== '全部' || selectedScene !== '全部' ||
    selectedPriceRange.label !== '全部' || minRating > 0 || onlyOpen

  const clearAll = () => {
    setSelectedCuisine('全部')
    setSelectedScene('全部')
    setSelectedPriceRange(priceRanges[0])
    setMinRating(0)
    setOnlyOpen(false)
  }

  return (
    <div className="space-y-3">
      {/* Quick filter chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setExpanded(!expanded)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer whitespace-nowrap glass ${
            hasFilters ? 'text-primary' : 'text-text-secondary'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          筛选
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>

        {cuisineTypes.filter(c => c !== '全部').slice(0, 6).map(cuisine => (
          <button
            key={cuisine}
            onClick={() => setSelectedCuisine(selectedCuisine === cuisine ? '全部' : cuisine)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedCuisine === cuisine
                ? 'glass-accent text-primary font-semibold'
                : 'glass text-text-secondary'
            }`}
          >
            {cuisineEmoji[cuisine] && <span className="mr-0.5">{cuisineEmoji[cuisine]}</span>}{cuisine}
          </button>
        ))}
      </div>

      {/* Expanded filters */}
      {expanded && (
        <div className="glass-strong rounded-3xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text">详细筛选</span>
            {hasFilters && (
              <button onClick={clearAll} className="text-xs text-primary cursor-pointer hover:underline">
                清除全部
              </button>
            )}
          </div>

          {/* Scene tags */}
          <div>
            <p className="text-xs text-text-muted mb-2">用餐场景</p>
            <div className="flex flex-wrap gap-2">
              {sceneTypes.map(scene => (
                <button
                  key={scene}
                  onClick={() => setSelectedScene(selectedScene === scene ? '全部' : scene)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    selectedScene === scene
                      ? 'glass-accent text-primary font-semibold'
                      : 'glass-subtle text-text-secondary'
                  }`}
                >
                  {scene}
                </button>
              ))}
            </div>
          </div>

          {/* Price range */}
          <div>
            <p className="text-xs text-text-muted mb-2">人均价格</p>
            <div className="flex flex-wrap gap-2">
              {priceRanges.map(range => (
                <button
                  key={range.label}
                  onClick={() => setSelectedPriceRange(range)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    selectedPriceRange.label === range.label
                      ? 'bg-accent text-white'
                      : 'bg-stone-50 text-text-secondary hover:bg-stone-100'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rating + Open */}
          <div className="flex flex-wrap gap-4">
            <div>
              <p className="text-xs text-text-muted mb-2">最低评分</p>
              <div className="flex gap-2">
                {[0, 4, 4.5].map(r => (
                  <button
                    key={r}
                    onClick={() => setMinRating(r)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      minRating === r
                        ? 'bg-accent text-white'
                        : 'bg-stone-50 text-text-secondary hover:bg-stone-100'
                    }`}
                  >
                    {r === 0 ? '不限' : `${r}星+`}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-text-muted mb-2">营业状态</p>
              <button
                onClick={() => setOnlyOpen(!onlyOpen)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  onlyOpen
                    ? 'bg-green-500 text-white'
                    : 'bg-stone-50 text-text-secondary hover:bg-stone-100'
                }`}
              >
                仅看营业中
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
