import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Star, Heart, Clock } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function RestaurantCard({ restaurant, compact = false, mini = false }) {
  const navigate = useNavigate()
  const { favorites, toggleFavorite, getDistance, selectedSchool } = useApp()
  const isFav = favorites.includes(restaurant.id)
  const [bouncing, setBouncing] = useState(false)

  const handleFav = (e) => {
    e.stopPropagation()
    setBouncing(true)
    toggleFavorite(restaurant.id)
    setTimeout(() => setBouncing(false), 400)
  }

  const dist = getDistance(restaurant)
  const distText = dist != null
    ? dist < 1000 ? `${Math.round(dist)}m` : `${(dist / 1000).toFixed(1)}km`
    : null

  if (mini) {
    return (
      <div
        onClick={() => navigate(`/restaurant/${restaurant.id}`)}
        className="flex items-center gap-3 p-3 glass rounded-2xl hover:shadow-md transition-all duration-200 cursor-pointer group"
      >
        <img
          src={restaurant.cover}
          alt={restaurant.name}
          className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
          loading="lazy"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-text truncate group-hover:text-primary transition-colors">{restaurant.name}</h3>
            <span className="text-sm font-bold text-primary flex-shrink-0">¥{restaurant.avgPrice}</span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs text-text-muted">
            <span className="flex items-center gap-0.5">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-text-secondary font-medium">{restaurant.rating}</span>
            </span>
            <span className="glass-subtle rounded-lg px-1.5 py-0.5 text-text-muted">{restaurant.cuisine}</span>
            {distText && <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{distText}</span>}
          </div>
        </div>
        <button
          onClick={handleFav}
          className="p-1.5 flex-shrink-0 cursor-pointer"
          aria-label={isFav ? '取消收藏' : '收藏'}
        >
          <Heart className={`w-4 h-4 transition-colors ${bouncing ? 'heart-bounce' : ''} ${isFav ? 'text-primary fill-primary' : 'text-stone-300 hover:text-primary'}`} />
        </button>
      </div>
    )
  }

  if (compact) {
    return (
      <div
        onClick={() => navigate(`/restaurant/${restaurant.id}`)}
        className="flex gap-3 p-3 glass rounded-2xl hover:shadow-md transition-all duration-200 cursor-pointer group"
      >
        <div className="relative flex-shrink-0">
          <img
            src={restaurant.cover}
            alt={restaurant.name}
            className="w-24 h-24 rounded-xl object-cover"
            loading="lazy"
          />
          {/* Rating badge on image */}
          <span className="absolute bottom-1 left-1 flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-500/90 backdrop-blur-sm rounded-lg text-white text-xs font-bold">
            <Star className="w-3 h-3 fill-white" />{restaurant.rating}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-text truncate group-hover:text-primary transition-colors">{restaurant.name}</h3>
            <button
              onClick={handleFav}
              className="p-1 flex-shrink-0 cursor-pointer"
              aria-label={isFav ? '取消收藏' : '收藏'}
            >
              <Heart className={`w-4 h-4 transition-colors ${bouncing ? 'heart-bounce' : ''} ${isFav ? 'text-primary fill-primary' : 'text-stone-300 hover:text-primary'}`} />
            </button>
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs text-text-secondary">
            <span className="font-bold text-accent text-sm">¥{restaurant.avgPrice}<span className="font-normal text-text-muted">/人</span></span>
            <span className="px-1.5 py-0.5 bg-stone-100 rounded text-text-muted">{restaurant.cuisine}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {restaurant.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-primary/8 text-primary/80">{tag}</span>
            ))}
          </div>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-text-muted">
            {distText && <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{distText}</span>}
            {restaurant.isOpen
              ? <span className="flex items-center gap-0.5 text-green-600"><Clock className="w-3 h-3" />营业中</span>
              : <span className="flex items-center gap-0.5 text-red-400"><Clock className="w-3 h-3" />已打烊</span>
            }
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
      className="glass rounded-3xl overflow-hidden hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
    >
      <div className="relative">
        <img
          src={restaurant.cover}
          alt={restaurant.name}
          className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Gradient overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
        <button
          onClick={handleFav}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur rounded-full hover:bg-white transition-colors cursor-pointer"
          aria-label={isFav ? '取消收藏' : '收藏'}
        >
          <Heart className={`w-4 h-4 transition-colors ${bouncing ? 'heart-bounce' : ''} ${isFav ? 'text-primary fill-primary' : 'text-stone-400'}`} />
        </button>
        {/* Tags on image */}
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          {restaurant.tags.slice(0, 2).map(tag => (
            <span key={tag} className="glass-dark rounded-full text-xs px-2 py-1 text-white">{tag}</span>
          ))}
        </div>
        {/* Rating badge */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 bg-amber-500/90 backdrop-blur-sm rounded-xl text-white text-xs font-bold shadow">
          <Star className="w-3.5 h-3.5 fill-white" />
          {restaurant.rating}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-text group-hover:text-primary transition-colors">{restaurant.name}</h3>
          <span className="text-base font-bold text-primary whitespace-nowrap">¥{restaurant.avgPrice}<span className="text-xs font-normal text-text-muted">/人</span></span>
        </div>
        <div className="flex items-center gap-2 mt-2 text-sm text-text-secondary">
          <span className="text-text-muted">({restaurant.ratingCount}条)</span>
          <span className="px-2 py-0.5 bg-stone-100 rounded-full text-xs">{restaurant.cuisine}</span>
        </div>
        <div className="flex items-center justify-between mt-3 text-xs text-text-muted">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {distText || restaurant.address.slice(0, 12)}
          </span>
          {restaurant.isOpen
            ? <span className="flex items-center gap-1 text-green-600"><Clock className="w-3.5 h-3.5" />营业中</span>
            : <span className="flex items-center gap-1 text-red-400"><Clock className="w-3.5 h-3.5" />已打烊</span>
          }
        </div>
      </div>
    </div>
  )
}
