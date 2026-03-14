import { Star } from 'lucide-react'

export default function StarRating({ rating, size = 'sm', interactive = false, onChange }) {
  const sizeMap = { sm: 'w-3.5 h-3.5', md: 'w-5 h-5', lg: 'w-6 h-6' }
  const iconSize = sizeMap[size] || sizeMap.sm

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type={interactive ? 'button' : undefined}
          onClick={interactive ? () => onChange?.(i) : undefined}
          disabled={!interactive}
          className={interactive ? 'cursor-pointer' : 'cursor-default'}
          aria-label={interactive ? `评 ${i} 星` : undefined}
        >
          <Star
            className={`${iconSize} transition-colors ${
              i <= rating ? 'text-accent fill-accent' : 'text-stone-200'
            }`}
          />
        </button>
      ))}
    </div>
  )
}
