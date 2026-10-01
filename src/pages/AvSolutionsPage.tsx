import { useSearchParams } from 'react-router-dom'
import { AvSolutionsSection } from '../components/home/AvSolutions'
import { SignageServices } from '../components/home/SignageServices'
import { avCategories, type AvCategoryId } from '../data/avProducts'
import { usePageMeta } from '../lib/seo'

export default function AvSolutionsPage() {
  const [params] = useSearchParams()
  const cat = params.get('cat')
  const initial = avCategories.some((c) => c.id === cat) ? (cat as AvCategoryId) : 'all'
  usePageMeta({
    title: 'Audio & Video Solutions',
    description:
      'Video conferencing endpoints, PTZ cameras, conference audio, room control, interactive classroom equipment and digital signage — procured, installed and supported by Zova Infotech.',
  })
  return (
    <>
      <AvSolutionsSection asPage showcaseLimit={null} initialFilter={initial} />
      {/* Signage visitors (Digital Signage menu link) get the service list; it also closes the full AV page. */}
      <SignageServices />
    </>
  )
}
