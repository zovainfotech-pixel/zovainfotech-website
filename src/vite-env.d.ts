/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string
  readonly VITE_CONTACT_PHONE?: string
  readonly VITE_CONTACT_PHONE_E164?: string
  readonly VITE_CONTACT_EMAIL?: string
  readonly VITE_WHATSAPP_NUMBER?: string
  readonly VITE_ENQUIRY_ENDPOINT?: string
  readonly VITE_HASH_ROUTER?: string
  readonly VITE_IMAGE_BASE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
