import { useNavigate } from 'react-router-dom'
import { Star, TrendingUp, Sparkles, BadgeDollarSign, Flame } from 'lucide-react'

const categoryConfig = {
  hot: { label: '🔥 本周热门', bg: 'bg-primary/85 backdrop-blur-sm' },
  rated: { label: '⭐ 高分新发现', bg: 'bg-amber-500/85 backdrop-blur-sm' },
  value: { label: '💰 性价比之王', bg: 'bg-green-600/85 backdrop-blur-sm' },
  pick: { label: '✨ 编辑推荐', bg: 'bg-purple-500/85 backdrop-blur-sm' },
}

function HeroCard({ restaurant, category, className = '', aspectClass = '' }) {
  const navigate = useNavigate()
  const config = categoryConfig[category]

  return (
    <div
      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
      className={`relative overflow-hidden cursor-pointer group ${className}`}
    >
      <img
        src={restaurant.cover}
        alt={restaurant.name}
        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${aspectClass}`}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      {/* Category tag */}
      <span className={`absolute top-3 left-3 text-xs font-semibold text-white px-2.5 py-1 rounded-full ${config.bg}`}>
        {config.label}
      </span>
      {/* Info at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h3 className="text-white font-bold text-sm truncate">{restaurant.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="flex items-center gap-0.5 text-white/90 text-xs">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            {restaurant.rating}
          </span>
          <span className="text-white/70 text-xs">¥{restaurant.avgPrice}/人</span>
          <span className="text-white/60 text-xs">{restaurant.cuisine}</span>
        </div>
      </div>
    </div>
  )
}

export default function MagazineHero({ heroRestaurants }) {
  if (!heroRestaurants || heroRestaurants.length === 0) return null

  const [hot, rated, value, pick] = heroRestaurants

  // If fewer than 4, show simplified layout
  if (heroRestaurants.length < 4) {
    return (
      <div className="grid grid-cols-2 gap-2 rounded-3xl overflow-hidden">
        {heroRestaurants.map((r, i) => (
          <HeroCard
            key={r.id}
            restaurant={r}
            category={['hot', 'rated', 'value', 'pick'][i]}
            className="rounded-2xl"
            aspectClass="h-40"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {/* Top row: left large + right stacked */}
      <div className="flex gap-2 h-[280px]">
        {/* Large card — 本周热门 */}
        <HeroCard
          restaurant={hot}
          category="hot"
          className="w-[60%] rounded-2xl"
        />
        {/* Right column */}
        <div className="w-[40%] flex flex-col gap-2">
          {/* 高分新发现 */}
          <HeroCard
            restaurant={rated}
            category="rated"
            className="flex-1 rounded-2xl"
          />
          {/* 性价比之王 */}
          <HeroCard
            restaurant={value}
            category="value"
            className="flex-1 rounded-2xl"
          />
        </div>
      </div>
      {/* Bottom banner — 编辑推荐 */}
      <HeroCard
        restaurant={pick}
        category="pick"
        className="h-[90px] rounded-2xl"
      />
    </div>
  )
}
