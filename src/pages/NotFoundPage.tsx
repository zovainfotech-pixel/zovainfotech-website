import { ArrowRight } from 'lucide-react'
import { Logo } from '../components/brand/Logo'
import { Button } from '../components/ui/Button'
import { paths } from '../data/routes'
import { usePageMeta } from '../lib/seo'

export default function NotFoundPage() {
  usePageMeta({ title: 'Page not found', description: 'The page you are looking for could not be found.', index: false })
  return (
    <section className="container-x flex min-h-[60vh] flex-col items-center justify-center gap-5 py-24 text-center">
      <Logo />
      <span className="font-mono text-sm font-semibold tracking-[0.14em] text-brand-600">ERROR 404</span>
      <h1 className="text-4xl font-bold tracking-[-0.03em] sm:text-5xl">We couldn’t find that page.</h1>
      <p className="max-w-md text-muted">The link may be outdated or the product may no longer be listed. Try the catalogue or tell us what you need.</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button to={paths.products} iconRight={<ArrowRight size={17} />}>
          Browse products
        </Button>
        <Button to={paths.quote} variant="secondary">
          Request a product
        </Button>
      </div>
    </section>
  )
}
