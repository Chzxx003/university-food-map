import { useMemo } from 'react'
import { Heart, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import RestaurantCard from '../components/RestaurantCard'

export default function FavoritesPage() {
  const { allRestaurants, favorites } = useApp()
  const navigate = useNavigate()

  const favRestaurants = useMemo(() =>
    allRestaurants.filter(r => favorites.includes(r.id)),
    [allRestaurants, favorites]
  )

  return (
    <div className="px-4 pb-24 md:pb-8">
      <div className="pt-6 pb-4">
        <h1 className="text-2xl font-bold text-text">我的收藏</h1>
        <p className="text-sm text-text-secondary mt-1">
          {favRestaurants.length > 0
            ? `已收藏 ${favRestaurants.length} 家餐厅`
            : '收藏你喜欢的餐厅，下次更快找到'}
        </p>
      </div>

      {favRestaurants.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full glass-accent flex items-center justify-center">
            <Heart className="w-8 h-8 text-primary/30" />
          </div>
          <p className="text-text-secondary font-medium">还没有收藏</p>
          <p className="text-sm text-text-muted mt-1">浏览餐厅时点击爱心即可收藏</p>
          <button
            onClick={() => navigate('/')}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-medium shadow-lg shadow-primary/20 hover:shadow-xl transition-all cursor-pointer"
          >
            去逛逛 <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favRestaurants.map((r, i) => (
            <div key={r.id} className="card-animate" style={{ animationDelay: `${i * 60}ms` }}>
              <RestaurantCard restaurant={r} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
