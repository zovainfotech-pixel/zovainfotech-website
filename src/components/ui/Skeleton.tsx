export function PageSkeleton() {
  return (
    <div className="container-x py-16" aria-busy="true" aria-label="Loading page">
      <div className="skeleton h-5 w-40" />
      <div className="skeleton mt-4 h-10 w-2/3 max-w-xl" />
      <div className="skeleton mt-3 h-5 w-1/2 max-w-md" />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton h-44 rounded-none" />
      <div className="flex flex-col gap-3 p-5">
        <div className="skeleton h-3 w-16" />
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-5/6" />
        <div className="skeleton mt-2 h-10 w-full" />
      </div>
    </div>
  )
}
