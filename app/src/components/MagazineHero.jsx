import { useNavigate } from 'react-router-dom'
import { Star, Flame, Sparkles, BadgeDollarSign, TrendingUp } from 'lucide-react'

const categoryConfig = {
  hot: { label: '本周热门', icon: Flame, bg: 'bg-primary/85 backdrop-blur-sm' },
  rated: { label: '高分新发现', icon: TrendingUp, bg: 'bg-amber-500/85 backdrop-blur-sm' },
  value: { label: '性价比之王', icon: BadgeDollarSign, bg: 'bg-green-600/85 backdrop-blur-sm' },
  pick: { label: '编辑推荐', icon: Sparkles, bg: 'bg-purple-500/85 backdrop-blur-sm' },
}

function HeroCard({ restaurant, category, className = '' }) {
  const navigate = useNavigate()
  const config = categoryConfig[category]
  const Icon = config.icon

  return (
    <div
      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
      className={`relative overflow-hidden cursor-pointer group ${className}`}
    >
      <img
        src={restaurant.cover}
        alt={restaurant.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <span className={`absolute top-3 left-3 text-xs lg:text-sm font-semibold text-white px-2.5 lg:px-3 py-1 lg:py-1.5 rounded-full flex items-center gap-1 lg:gap-1.5 ${config.bg}`}>
        <Icon className="w-3 h-3 lg:w-4 lg:h-4" />
        {config.label}
      </span>
      <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-4">
        <h3 className="text-white font-bold text-sm lg:text-base truncate">{restaurant.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="flex items-center gap-0.5 text-white/90 text-xs lg:text-sm">
            <Star className="w-3 h-3 lg:w-3.5 lg:h-3.5 fill-amber-400 text-amber-400" />
            {restaurant.rating}
          </span>
          <span className="text-white/70 text-xs lg:text-sm">¥{restaurant.avgPrice}/人</span>
          <span className="text-white/60 text-xs lg:text-sm">{restaurant.cuisine}</span>
        </div>
      </div>
    </div>
  )
}

export default function MagazineHero({ heroRestaurants }) {
  if (!heroRestaurants || heroRestaurants.length < 4) return null

  const [hot, rated, value, pick] = heroRestaurants

  return (
    <div className="grid grid-cols-3 grid-rows-2 gap-2 h-[240px] sm:h-[280px] lg:h-[360px] 2xl:h-[420px]">
      {/* 本周热门 — spans 2 rows left */}
      <HeroCard
        restaurant={hot}
        category="hot"
        className="row-span-2 rounded-2xl"
      />
      {/* 高分新发现 — top middle */}
      <HeroCard
        restaurant={rated}
        category="rated"
        className="rounded-2xl"
      />
      {/* 编辑推荐 — top right */}
      <HeroCard
        restaurant={pick}
        category="pick"
        className="rounded-2xl"
      />
      {/* 性价比之王 — bottom right, spans 2 cols */}
      <HeroCard
        restaurant={value}
        category="value"
        className="col-span-2 rounded-2xl"
      />
    </div>
  )
}
