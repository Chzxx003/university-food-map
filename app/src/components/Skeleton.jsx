export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden">
      <div className="skeleton h-40 sm:h-48" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <div className="skeleton h-5 w-24" />
          <div className="skeleton h-5 w-10" />
        </div>
        <div className="flex gap-2">
          <div className="skeleton h-4 w-12" />
          <div className="skeleton h-4 w-8" />
          <div className="skeleton h-4 w-14" />
        </div>
        <div className="flex justify-between">
          <div className="skeleton h-3.5 w-28" />
          <div className="skeleton h-3.5 w-14" />
        </div>
      </div>
    </div>
  )
}

export function CardSkeletonCompact() {
  return (
    <div className="flex gap-3 p-3 bg-white rounded-xl border border-border">
      <div className="skeleton w-24 h-24 flex-shrink-0" />
      <div className="flex-1 space-y-2.5 py-1">
        <div className="skeleton h-5 w-28" />
        <div className="flex gap-2">
          <div className="skeleton h-3.5 w-10" />
          <div className="skeleton h-3.5 w-16" />
        </div>
        <div className="flex gap-1.5">
          <div className="skeleton h-5 w-12 rounded-full" />
          <div className="skeleton h-5 w-12 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function MagazineHeroSkeleton() {
  return (
    <div className="space-y-2">
      <div className="flex gap-2 h-[280px]">
        <div className="skeleton w-[60%] rounded-2xl" />
        <div className="w-[40%] flex flex-col gap-2">
          <div className="skeleton flex-1 rounded-2xl" />
          <div className="skeleton flex-1 rounded-2xl" />
        </div>
      </div>
      <div className="skeleton h-[90px] rounded-2xl" />
    </div>
  )
}

export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 glass rounded-2xl">
      <div className="skeleton w-12 h-12 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex justify-between">
          <div className="skeleton h-4 w-24" />
          <div className="skeleton h-4 w-8" />
        </div>
        <div className="flex gap-2">
          <div className="skeleton h-3 w-10" />
          <div className="skeleton h-3 w-14 rounded-lg" />
        </div>
      </div>
      <div className="skeleton w-4 h-4 rounded-full" />
    </div>
  )
}

export function DetailSkeleton() {
  return (
    <div className="pb-24 md:pb-8">
      <div className="skeleton h-56 sm:h-72 md:h-80" style={{ borderRadius: 0 }} />
      <div className="px-4 max-w-4xl mx-auto space-y-6 pt-6">
        <div className="space-y-3 pb-6 border-b border-border">
          <div className="skeleton h-7 w-40" />
          <div className="flex gap-2">
            <div className="skeleton h-6 w-14 rounded-full" />
            <div className="skeleton h-6 w-16 rounded-full" />
          </div>
          <div className="skeleton h-4 w-64" />
        </div>
        <div className="space-y-3 pb-6 border-b border-border">
          <div className="skeleton h-6 w-24" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1,2,3,4].map(i => (
              <div key={i}>
                <div className="skeleton h-28 mb-2" />
                <div className="skeleton h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function RankSkeleton() {
  return (
    <div className="space-y-3">
      {[1,2,3,4,5].map(i => (
        <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-border">
          <div className="skeleton w-6 h-6 rounded-full" />
          <div className="skeleton w-16 h-16 rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-5 w-28" />
            <div className="skeleton h-3.5 w-20" />
          </div>
          <div className="skeleton h-6 w-10" />
        </div>
      ))}
    </div>
  )
}
