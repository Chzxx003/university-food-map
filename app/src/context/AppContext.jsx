import { createContext, useContext, useState, useMemo, useCallback } from 'react'
import { restaurants, cuisineTypes, sceneTypes, priceRanges } from '../data/restaurants'
import { schools } from '../data/schools'
import { useToast } from '../components/Toast'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const showToast = useToast()
  const [selectedSchool, setSelectedSchool] = useState(schools[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCuisine, setSelectedCuisine] = useState('全部')
  const [selectedScene, setSelectedScene] = useState('全部')
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0])
  const [minRating, setMinRating] = useState(0)
  const [onlyOpen, setOnlyOpen] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('default')
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('foodmap_favorites') || '[]')
    } catch { return [] }
  })
  const [userReviews, setUserReviews] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('foodmap_reviews') || '[]')
    } catch { return [] }
  })

  const [likedReviews, setLikedReviews] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('foodmap_likes') || '[]')
    } catch { return [] }
  })

  const toggleFavorite = useCallback((id) => {
    setFavorites(prev => {
      const isFav = prev.includes(id)
      const next = isFav ? prev.filter(f => f !== id) : [...prev, id]
      localStorage.setItem('foodmap_favorites', JSON.stringify(next))
      const name = restaurants.find(r => r.id === id)?.name || ''
      showToast(isFav ? `已取消收藏${name}` : `已收藏${name}`, 'favorite')
      return next
    })
  }, [showToast])

  const addReview = useCallback((restaurantId, review) => {
    const newReview = {
      id: Date.now(),
      ...review,
      time: new Date().toISOString().split('T')[0],
      likes: 0,
    }
    setUserReviews(prev => {
      const next = [newReview, ...prev]
      localStorage.setItem('foodmap_reviews', JSON.stringify(next))
      return next
    })
    showToast('评价发布成功！', 'success')
    return newReview
  }, [showToast])

  const toggleLike = useCallback((reviewId) => {
    setLikedReviews(prev => {
      const isLiked = prev.includes(reviewId)
      const next = isLiked ? prev.filter(id => id !== reviewId) : [...prev, reviewId]
      localStorage.setItem('foodmap_likes', JSON.stringify(next))
      if (!isLiked) showToast('已点赞', 'like')
      return next
    })
  }, [showToast])

  const getDistance = useCallback((restaurant) => {
    if (selectedSchool.id === 'all') return null
    const R = 6371000
    const dLat = (restaurant.lat - selectedSchool.lat) * Math.PI / 180
    const dLng = (restaurant.lng - selectedSchool.lng) * Math.PI / 180
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(selectedSchool.lat * Math.PI / 180) * Math.cos(restaurant.lat * Math.PI / 180) *
      Math.sin(dLng / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  }, [selectedSchool])

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter(r => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const matchName = r.name.toLowerCase().includes(q)
        const matchCuisine = r.cuisine.toLowerCase().includes(q)
        const matchDish = r.dishes.some(d => d.name.toLowerCase().includes(q))
        if (!matchName && !matchCuisine && !matchDish) return false
      }
      if (selectedCuisine !== '全部' && r.cuisine !== selectedCuisine) return false
      if (selectedScene !== '全部' && !r.tags.includes(selectedScene)) return false
      if (r.avgPrice < selectedPriceRange.min || r.avgPrice > selectedPriceRange.max) return false
      if (minRating > 0 && r.rating < minRating) return false
      if (onlyOpen && !r.isOpen) return false
      if (selectedSchool.id !== 'all' && r.nearSchool !== selectedSchool.id) return false
      return true
    }).sort((a, b) => {
      if (selectedSchool.id !== 'all') {
        return getDistance(a) - getDistance(b)
      }
      return b.rating - a.rating
    })
  }, [searchQuery, selectedCuisine, selectedScene, selectedPriceRange, minRating, onlyOpen, selectedSchool, getDistance])

  // Hero restaurants: mixed strategy selection from filtered results
  const heroRestaurants = useMemo(() => {
    if (filteredRestaurants.length < 2) return []
    const pool = [...filteredRestaurants]
    const heroes = []
    const used = new Set()

    // 1. 本周热门 — highest visits
    const hot = pool.reduce((best, r) => (!used.has(r.id) && r.visits > (best?.visits ?? -1)) ? r : best, null)
    if (hot) { heroes.push(hot); used.add(hot.id) }

    // 2. 高分新发现 — highest rating (excluding hot)
    const rated = pool.reduce((best, r) => (!used.has(r.id) && r.rating > (best?.rating ?? -1)) ? r : best, null)
    if (rated) { heroes.push(rated); used.add(rated.id) }

    // 3. 性价比之王 — highest rating/avgPrice (excluding used)
    const value = pool.reduce((best, r) => {
      if (used.has(r.id)) return best
      const score = r.rating / r.avgPrice
      return score > ((best?.rating ?? 0) / (best?.avgPrice ?? 1)) ? r : best
    }, null)
    if (value) { heroes.push(value); used.add(value.id) }

    // 4. 编辑推荐 — seeded random from remaining
    const remaining = pool.filter(r => !used.has(r.id))
    if (remaining.length > 0) {
      // Simple seed: use day of year for stability within same day
      const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
      const idx = dayOfYear % remaining.length
      heroes.push(remaining[idx])
    }

    return heroes
  }, [filteredRestaurants])

  // List restaurants: filtered minus hero ones, with sorting
  const listRestaurants = useMemo(() => {
    const heroIds = new Set(heroRestaurants.map(r => r.id))
    const list = filteredRestaurants.filter(r => !heroIds.has(r.id))

    if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === 'price') {
      list.sort((a, b) => a.avgPrice - b.avgPrice)
    } else if (sortBy === 'distance' && selectedSchool.id !== 'all') {
      list.sort((a, b) => getDistance(a) - getDistance(b))
    }
    // 'default' keeps the filteredRestaurants order

    return list
  }, [filteredRestaurants, heroRestaurants, sortBy, selectedSchool, getDistance])

  const getAllReviews = useCallback((restaurantId) => {
    const original = restaurants.find(r => r.id === restaurantId)?.reviews || []
    const user = userReviews.filter(r => r.restaurantId === restaurantId)
    return [...user, ...original]
  }, [userReviews])

  const value = useMemo(() => ({
    schools,
    selectedSchool, setSelectedSchool,
    searchQuery, setSearchQuery,
    selectedCuisine, setSelectedCuisine,
    selectedScene, setSelectedScene,
    selectedPriceRange, setSelectedPriceRange,
    minRating, setMinRating,
    onlyOpen, setOnlyOpen,
    viewMode, setViewMode,
    sortBy, setSortBy,
    favorites, toggleFavorite,
    filteredRestaurants,
    heroRestaurants,
    listRestaurants,
    allRestaurants: restaurants,
    cuisineTypes, sceneTypes, priceRanges,
    getDistance,
    addReview, getAllReviews,
    likedReviews, toggleLike,
  }), [
    selectedSchool, searchQuery, selectedCuisine, selectedScene,
    selectedPriceRange, minRating, onlyOpen, viewMode, sortBy, favorites,
    filteredRestaurants, heroRestaurants, listRestaurants, getDistance, toggleFavorite, addReview, getAllReviews,
    likedReviews, toggleLike,
  ])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be inside AppProvider')
  return ctx
}
