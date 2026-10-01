import { lazy } from 'react'
import { createBrowserRouter, createHashRouter, Navigate, RouterProvider } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { paths } from './data/routes'
import HomePage from './pages/HomePage'

// Route-level code splitting: the home page ships in the main bundle, everything else loads on demand.
const CataloguePage = lazy(() => import('./pages/CataloguePage'))
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'))
const ServicesPage = lazy(() => import('./pages/ServicesPage'))
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage'))
const MicrosoftSecurityPage = lazy(() => import('./pages/MicrosoftSecurityPage'))
const AvSolutionsPage = lazy(() => import('./pages/AvSolutionsPage'))
const CorporatePage = lazy(() => import('./pages/CorporatePage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const QuotePage = lazy(() => import('./pages/QuotePage'))
const VendorPage = lazy(() => import('./pages/VendorPage'))
const LegalPage = lazy(() => import('./pages/LegalPage'))
const CompareHeadsetsPage = lazy(() => import('./pages/CompareHeadsetsPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

// Hash routing is used only for single-file previews (VITE_HASH_ROUTER=1); production uses clean URLs.
const createRouter = import.meta.env.VITE_HASH_ROUTER === '1' ? createHashRouter : createBrowserRouter
const router = createRouter([
  {
    element: <Layout />,
    children: [
      { path: paths.home, element: <HomePage /> },
      { path: paths.products, element: <CataloguePage /> },
      { path: '/products/:category', element: <CataloguePage /> },
      { path: '/products/headsets', element: <Navigate replace to="/products/headsets-audio-solutions" /> },
      { path: '/products/:category/:sub', element: <CataloguePage /> },
      { path: paths.compare, element: <CompareHeadsetsPage /> },
      { path: '/product/:slug', element: <ProductDetailPage /> },
      { path: paths.services, element: <ServicesPage /> },
      { path: paths.av, element: <AvSolutionsPage /> },
      { path: paths.microsoft, element: <MicrosoftSecurityPage /> },
      { path: '/services/:slug', element: <ServiceDetailPage /> },
      { path: paths.corporate, element: <CorporatePage /> },
      { path: paths.about, element: <AboutPage /> },
      { path: paths.contact, element: <ContactPage /> },
      { path: paths.quote, element: <QuotePage /> },
      { path: paths.vendor, element: <VendorPage /> },
      { path: paths.privacy, element: <LegalPage doc="privacy" /> },
      { path: paths.terms, element: <LegalPage doc="terms" /> },
      { path: paths.shipping, element: <LegalPage doc="shipping" /> },
      { path: paths.returns, element: <LegalPage doc="returns" /> },
      { path: paths.warranty, element: <LegalPage doc="warranty" /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
