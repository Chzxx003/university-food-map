import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Heart, Star, MapPin, Phone, Clock,
  ChevronLeft, ChevronRight, Send, ThumbsUp,
} from 'lucide-react'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import { useApp } from '../context/AppContext'
import StarRating from '../components/StarRating'

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

export default function DetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { allRestaurants, favorites, toggleFavorite, getAllReviews, addReview, likedReviews, toggleLike } = useApp()

  const restaurant = allRestaurants.find(r => r.id === Number(id))
  const reviews = useMemo(() => restaurant ? getAllReviews(restaurant.id) : [], [restaurant, getAllReviews])
  const isFav = restaurant ? favorites.includes(restaurant.id) : false

  const [galleryIdx, setGalleryIdx] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewName, setReviewName] = useState('')

  if (!restaurant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <p className="text-text-secondary text-lg mb-4">餐厅不存在</p>
        <button onClick={() => navigate('/')} className="text-primary hover:underline cursor-pointer">返回首页</button>
      </div>
    )
  }

  const gallery = restaurant.gallery || [restaurant.cover]

  const handleSubmitReview = (e) => {
    e.preventDefault()
    if (!reviewText.trim() || reviewText.trim().length < 10) return
    addReview(restaurant.id, {
      restaurantId: restaurant.id,
      user: reviewName.trim() || '匿名用户',
      rating: reviewRating,
      text: reviewText.trim(),
    })
    setReviewText('')
    setReviewRating(5)
    setReviewName('')
  }

  return (
    <div className="pb-24 md:pb-8 max-w-3xl mx-auto">
      {/* Gallery */}
      <div className="relative h-56 sm:h-72 md:h-80 bg-stone-200">
        <img
          src={gallery[galleryIdx]}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-2 glass rounded-full hover:bg-white cursor-pointer transition-colors"
          aria-label="返回"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => toggleFavorite(restaurant.id)}
          className="absolute top-4 right-4 p-2 glass rounded-full hover:bg-white cursor-pointer transition-colors"
          aria-label={isFav ? '取消收藏' : '收藏'}
        >
          <Heart className={`w-5 h-5 ${isFav ? 'text-primary fill-primary' : 'text-stone-600'}`} />
        </button>

        {gallery.length > 1 && (
          <>
            <button
              onClick={() => setGalleryIdx(i => (i - 1 + gallery.length) % gallery.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 glass rounded-full hover:bg-white cursor-pointer transition-colors"
              aria-label="上一张"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setGalleryIdx(i => (i + 1) % gallery.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 glass rounded-full hover:bg-white cursor-pointer transition-colors"
              aria-label="下一张"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 items-center">
              {gallery.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setGalleryIdx(i)}
                  className={`rounded-full transition-all cursor-pointer ${i === galleryIdx ? 'w-5 h-2 bg-white' : 'w-2 h-2 bg-white/50 hover:bg-white/70'}`}
                  aria-label={`第 ${i + 1} 张图片`}
                />
              ))}
            </div>
            <div className="absolute bottom-4 right-4 px-2.5 py-1 glass-dark rounded-full text-xs text-white font-medium">
              {galleryIdx + 1} / {gallery.length}
            </div>
          </>
        )}
      </div>

      <div className="px-4 max-w-6xl mx-auto">
        {/* Basic info */}
        <div className="py-6 border-b border-white/20">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text">{restaurant.name}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {restaurant.tags.map(tag => (
                  <span key={tag} className="text-xs px-2.5 py-1 glass-accent rounded-full text-primary font-medium">{tag}</span>
                ))}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-accent fill-accent" />
                <span className="text-2xl font-bold text-text">{restaurant.rating}</span>
              </div>
              <p className="text-xs text-text-muted">{restaurant.ratingCount} 条评价</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            <div className="glass rounded-2xl p-3 flex flex-col items-center gap-1.5">
              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs text-text-secondary text-center leading-tight">{restaurant.address}</span>
            </div>
            <div className="glass rounded-2xl p-3 flex flex-col items-center gap-1.5">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                <Phone className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-xs text-text-secondary text-center">{restaurant.phone}</span>
            </div>
            <div className="glass rounded-2xl p-3 flex flex-col items-center gap-1.5">
              <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <span className="text-xs text-text-secondary text-center">{restaurant.hours}</span>
              {restaurant.isOpen
                ? <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">营业中</span>
                : <span className="text-[10px] px-2 py-0.5 bg-red-50 text-red-500 rounded-full font-medium">已打烊</span>
              }
            </div>
            <div className="glass-accent rounded-2xl p-3 flex flex-col items-center gap-1.5">
              <span className="text-xs text-text-muted">人均消费</span>
              <span className="text-xl font-bold text-primary">¥{restaurant.avgPrice}</span>
            </div>
          </div>
        </div>

        {/* Two-column layout on desktop */}
        <div className="lg:grid lg:grid-cols-5 lg:gap-8">
          {/* Left: dishes + reviews */}
          <div className="lg:col-span-3">
            {/* Dishes */}
            <div className="py-6 border-b border-white/20">
              <h2 className="text-lg font-bold text-text mb-4">推荐菜品</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3">
                {restaurant.dishes.map((dish, i) => (
                  <div key={i} className="glass rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                    <img src={dish.image} alt={dish.name} className="w-full h-28 object-cover" loading="lazy" />
                    <div className="p-2.5">
                      <p className="text-sm font-medium text-text truncate">{dish.name}</p>
                      <p className="text-sm font-bold text-accent mt-0.5">¥{dish.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="py-6">
          <h2 className="text-lg font-bold text-text mb-4">用户评价</h2>

          {/* Submit review form */}
          <form onSubmit={handleSubmitReview} className="glass-strong rounded-3xl p-4 mb-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text">写评价</span>
              <StarRating rating={reviewRating} size="md" interactive onChange={setReviewRating} />
            </div>
            <input
              type="text"
              value={reviewName}
              onChange={e => setReviewName(e.target.value)}
              placeholder="你的昵称（选填）"
              maxLength={20}
              className="w-full px-3 py-2 rounded-xl bg-white/40 border border-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <textarea
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              placeholder="分享你的用餐体验（至少 10 个字）..."
              rows={3}
              maxLength={200}
              className="w-full px-3 py-2 rounded-xl bg-white/40 border border-white/30 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">{reviewText.length}/200</span>
              <button
                type="submit"
                disabled={reviewText.trim().length < 10}
                className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark disabled:opacity-40 cursor-pointer transition-colors"
              >
                <Send className="w-4 h-4" /> 发布
              </button>
            </div>
          </form>

          {/* Review list */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-center text-text-muted py-8">暂无评价，来做第一个评价的人吧！</p>
            ) : (
              reviews.slice(0, 10).map(review => (
                <div key={review.id} className="glass rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold">
                        {review.user[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text">{review.user}</p>
                        <p className="text-xs text-text-muted">{review.time}</p>
                      </div>
                    </div>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="mt-3 text-sm text-text-secondary leading-relaxed">{review.text}</p>
                  <button
                    onClick={() => toggleLike(review.id)}
                    className={`flex items-center gap-1 mt-2 text-xs cursor-pointer transition-colors ${likedReviews.includes(review.id) ? 'text-primary font-medium' : 'text-text-muted hover:text-primary'}`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${likedReviews.includes(review.id) ? 'fill-primary' : ''}`} />
                    {review.likes + (likedReviews.includes(review.id) ? 1 : 0)}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
          </div>

          {/* Right: map + info sidebar (desktop) */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-20 space-y-4 py-6">
              {/* Mini map */}
              <div>
                <h2 className="text-lg font-bold text-text mb-4">位置</h2>
                <div className="h-48 lg:h-56 rounded-3xl overflow-hidden">
                  <MapContainer
                    center={[restaurant.lat, restaurant.lng]}
                    zoom={16}
                    className="h-full w-full"
                    zoomControl={false}
                    dragging={false}
                    scrollWheelZoom={false}
                  >
                    <TileLayer
                      attribution='&copy; OSM'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[restaurant.lat, restaurant.lng]} icon={redIcon} />
                  </MapContainer>
                </div>
                <p className="text-sm text-text-muted mt-2 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {restaurant.address}
                </p>
              </div>

              {/* Quick info card */}
              <div className="glass-strong rounded-3xl p-4 space-y-3">
                <h3 className="text-sm font-bold text-text">餐厅信息</h3>
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Phone className="w-4 h-4 text-text-muted flex-shrink-0" />
                    <span>{restaurant.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Clock className="w-4 h-4 text-text-muted flex-shrink-0" />
                    <span>{restaurant.hours}</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Star className="w-4 h-4 text-accent fill-accent flex-shrink-0" />
                    <span>{restaurant.rating} 分 · {restaurant.ratingCount} 条评价</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
