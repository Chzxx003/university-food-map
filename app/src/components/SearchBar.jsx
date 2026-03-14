import { Search, X } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useApp()

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
      <input
        type="text"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        placeholder="搜索餐厅、菜系、菜品..."
        className="w-full pl-12 pr-10 py-3.5 glass-strong rounded-2xl text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-stone-100 rounded-full cursor-pointer transition-colors"
          aria-label="清除搜索"
        >
          <X className="w-4 h-4 text-text-muted" />
        </button>
      )}
    </div>
  )
}
