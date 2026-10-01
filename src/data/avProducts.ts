/**
 * Audio & Video product showcase.
 *
 * PeopleLink items: names, specifications and images are taken from the PeopleLink product
 * presentation supplied by Zova Infotech (People_link.pptx). Images live in
 * /public/images/audio-video/. Do not add prices, stock or warranty terms here unless confirmed.
 *
 * Digital signage items are solution types (not specific models). They use representative renders
 * and are labelled as such; exact makes and models are proposed per project.
 *
 * To add a product: drop a .webp into public/images/audio-video/, then add an entry below.
 */
import type { MediaKey } from './media'

export type AvCategoryId =
  | 'signage'
  | 'vc-endpoints'
  | 'cameras'
  | 'ai-cameras'
  | 'conference-audio'
  | 'audio-control'
  | 'classroom'
  | 'healthcare'

export const avCategories: { id: AvCategoryId; label: string; short: string }[] = [
  { id: 'vc-endpoints', label: 'Video Conferencing Endpoints', short: 'VC endpoints' },
  { id: 'cameras', label: 'Conference Cameras & Webcams', short: 'Cameras' },
  { id: 'conference-audio', label: 'Conference Audio & Speakerphones', short: 'Conference audio' },
  { id: 'signage', label: 'Digital Signage Products & Solutions', short: 'Digital signage' },
  { id: 'ai-cameras', label: 'AI & Tracking Cameras', short: 'AI cameras' },
  { id: 'audio-control', label: 'Audio Processing & Room Control', short: 'DSP & control' },
  { id: 'classroom', label: 'Podiums & Interactive Classroom', short: 'Classroom' },
  { id: 'healthcare', label: 'Healthcare Video Carts', short: 'Healthcare' },
]

export interface AvImage {
  src: string
  w: number
  h: number
}

export interface AvItem {
  slug: string
  name: string
  category: AvCategoryId
  /** Manufacturer as shown in the supplied presentation. Omitted for generic solution types. */
  brand?: string
  /** Part numbers or variants, only where the presentation lists them. */
  models?: string[]
  summary: string
  specs: string[]
  idealFor?: string
  images: AvImage[]
  /** Representative render from the site's media registry, for solution types without a product photo. */
  render?: MediaKey
  kind: 'product' | 'solution'
}

const img = (file: string, w: number, h: number): AvImage => ({ src: `images/audio-video/${file}.webp`, w, h })
const PL = 'PeopleLink'

export const avItems: AvItem[] = [
  // ——— Video conferencing endpoints ———
  {
    slug: 'impact-pro-endpoint',
    name: 'Impact Pro Endpoint (P2P, 1+3)',
    brand: PL,
    category: 'vc-endpoints',
    kind: 'product',
    summary: 'H.323/SIP video conferencing endpoint with an integrated 12x PTZ camera and multipoint (1+3) support.',
    specs: [
      '1/2.7” CMOS sensor, 2.07 MP effective',
      '1080p @ 60 fps',
      '12x optical / 16x digital zoom',
      '72.5° field of view, 8 presets',
      'Protocols: H.323, SIP, ITU-T H.239, BFCP',
      'Video: H.261, H.263, H.263+, H.264, H.264 HP',
      'Audio: G.711, G.722, G.722.1, G.722.1C, AAC-LD, G.723.1, G.726, G.728, SILK',
      'Supports P2P and 1+3',
      'Video in: 1x DVI, integrated camera · Video out: 2x HDMI',
      'Audio in: 1x mic, 1x line · Recording: yes · USB: 2',
    ],
    images: [img('peoplelink-impact-pro-endpoint', 741, 547), img('peoplelink-impact-pro-endpoint-2', 800, 113)],
  },
  {
    slug: 'impact-pro-20x-endpoint',
    name: 'Impact Pro 20x Endpoint',
    brand: PL,
    category: 'vc-endpoints',
    kind: 'product',
    summary: 'H.323/SIP endpoint with integrated PTZ camera, dual stream and 1+3 multipoint.',
    specs: [
      '1080p @ 60 fps',
      '12x optical / 16x digital zoom',
      '60.7° field of view',
      'ITU-T H.323, IETF SIP',
      'Video: H.261, H.263, H.263+, H.263++, H.264, H.264 SVC, H.264 High Profile',
      'Audio: G.711, G.722, G.722.1*, G.722.1C*, AAC-LD, G.723.1, G.726, G.728, SILK',
      'Dual stream: ITU-T H.239, BFCP',
      'Supports P2P and 1+3',
      'Video in: 1x DVI, integrated camera · Video out: 2x HDMI',
      'Audio in: 1x mic, 1x line · Recording: yes · USB: 2',
    ],
    images: [img('peoplelink-impact-pro-20x-endpoint', 778, 609), img('peoplelink-impact-pro-20x-endpoint-2', 820, 116)],
  },
  {
    slug: 'impact-pro-codec',
    name: 'Impact Pro Codec (1+5)',
    brand: PL,
    category: 'vc-endpoints',
    kind: 'product',
    summary: 'Rack codec bundled with external PTZ cameras, supporting up to 1+5 multipoint.',
    specs: [
      '1080p @ 60 fps',
      'Bundled with external PTZ cameras (60.7° to 72.5° FOV)',
      'Protocols: ITU-T H.323, IETF SIP, ITU-T H.239, BFCP',
      'Video: H.261, H.263, H.263+, H.263++, H.264, H.264 SVC, H.264 High Profile',
      'Audio: G.711, G.722, G.722.1*, G.722.1C*, AAC-LD, G.726, SILK',
      'Supports P2P, 1+3 and 1+5',
      'Video in: 1x DVI, 1x HDMI, 1x 3G-SDI · Video out: 2x HDMI, 1x 3G-SDI',
      'Audio in: 2x mic, 1x line · Recording: yes · USB: 2',
    ],
    images: [img('peoplelink-impact-pro-codec', 988, 291), img('peoplelink-impact-pro-codec-2', 965, 138)],
  },
  {
    slug: 'impact-zeta-endpoint',
    name: 'Impact Zeta Endpoint',
    brand: PL,
    category: 'vc-endpoints',
    kind: 'product',
    summary: 'H.323/SIP codec with 12x PTZ camera and audio pod, supporting up to 1+5 multipoint.',
    specs: [
      '1/2.7” 2 MP sensor',
      '1080p @ 60 fps',
      '12x optical / 16x digital zoom',
      '72.5° field of view',
      'Protocols: ITU-T H.323, IETF SIP, ITU-T H.239, BFCP',
      'Video: H.261, H.263, H.263+, H.263++, H.264, H.264 SVC, H.264 High Profile',
      'Audio: G.711, G.722, G.722.1*, G.722.1C*, AAC-LD, G.726, SILK',
      'Supports P2P, 1+3 and 1+5',
      'Video in: 1x DVI, 1x HDMI, 1x 3G-SDI · Video out: 2x HDMI, 1x 3G-SDI',
      'Audio in: 2x mic, 1x line · Recording: yes · USB: 2',
      'Audio pickup range up to 6 m',
    ],
    images: [img('peoplelink-impact-zeta-endpoint', 909, 587), img('peoplelink-impact-zeta-endpoint-2', 965, 138)],
  },
  {
    slug: 'integrated-4k-huddle-endpoint',
    name: 'Integrated 4K Huddle Endpoint',
    brand: PL,
    models: ['H.323/SIP', 'Android'],
    category: 'vc-endpoints',
    kind: 'product',
    summary: 'All-in-one 4K huddle-room endpoint with built-in Android, camera and microphone.',
    specs: [
      'In-built Android 6.0',
      '4K Ultra HD video conferencing',
      '8x digital zoom · 84° FOV (Android variant)',
      'Built-in microphone · built-in AEC, AGC, ANS',
      'Distributes incoming video across two screens',
      'Dual stream: 1080p or 720p',
      'H.264 video · HDMI, USB 3.0, speaker out (Android variant)',
    ],
    images: [
      img('peoplelink-integrated-4k-huddle-endpoint', 906, 745),
      img('peoplelink-integrated-4k-huddle-endpoint-2', 863, 622),
      img('peoplelink-integrated-4k-huddle-endpoint-3', 1000, 865),
    ],
  },
  {
    slug: '4k-huddle-pro',
    name: '4K Huddle Pro',
    brand: PL,
    models: ['H.323/SIP', 'Android'],
    category: 'vc-endpoints',
    kind: 'product',
    summary: '4K ePTZ huddle endpoint with stereo microphones and a camera privacy shutter.',
    specs: [
      'ePTZ camera, 4K @ 30 fps',
      '4x digital zoom · 84° FOV',
      'Inbuilt stereo gain microphones, pickup up to 6 m',
      'Down-compatible with 1080p, 720p',
      'Dual 1080p or dual 720p',
      'Built-in AEC, AGC, ANS',
      'Privacy function to open or obscure the camera',
      'Android variant: in-built Android 6.0',
    ],
    images: [img('peoplelink-4k-huddle-pro', 915, 424), img('peoplelink-4k-huddle-pro-2', 1000, 413), img('peoplelink-4k-huddle-pro-3', 782, 591)],
  },
  {
    slug: 'instavc-pro-mcu',
    name: 'InstaVC Pro MCU',
    brand: PL,
    category: 'vc-endpoints',
    kind: 'product',
    summary: 'Multipoint control unit supporting WebRTC, H.323 and SIP for large multi-site meetings.',
    specs: [
      'WebRTC, H.323 and SIP protocols',
      'Video: H.263, H.264, H.264 HP, H.261, VP8',
      'Full HD business-to-business communication',
      'Up to 100 ports Full HD MCU',
      'Browser WebRTC dial-in (Chrome, Firefox, Safari, Opera)',
      'H.323/SIP dial-in or dial-out from web server',
      'H.239, dual video, BFCP',
      'Advanced continuous presence, up to 25 split screen',
      'Active speaker selection by remote or voice',
    ],
    images: [img('peoplelink-instavc-pro-mcu', 926, 253)],
  },
  {
    slug: 'windows-based-endpoint',
    name: 'Windows-Based Endpoint (FX Series)',
    brand: PL,
    models: ['FX Series 10x', 'FX Series 12x', 'FX Series', 'FX Series 4K'],
    category: 'vc-endpoints',
    kind: 'product',
    summary: 'Compact Windows endpoint for software video conferencing with data collaboration tools.',
    specs: [
      'Video resolution: 1080p @ 30 fps',
      'Audio in: 1x 3.5 mm line-in · Audio out: 1x 3.5 mm line-out',
      'Video out: 2x HD · Video input: 4x USB 3.0',
      'FHD multi-party connectivity, application sharing',
      'Digital whiteboard, presentation sharing, real-time annotation',
      'File transfer, rich media and remote desktop sharing',
    ],
    images: [img('peoplelink-windows-endpoint', 267, 1000), img('peoplelink-windows-endpoint-2', 193, 874)],
  },

  // ——— Cameras & webcams ———
  {
    slug: 'i3-plus-webcam',
    name: 'i3 Plus Webcam',
    brand: PL,
    category: 'cameras',
    kind: 'product',
    summary: 'Full HD USB webcam with stereo microphone for small huddle rooms.',
    specs: ['2 MP CMOS sensor', '1920 × 1080 @ 30 fps', '90° FOV', 'USB 2.0 (compatible with USB 3.0 port)', '1.5 m USB cable', 'Built-in stereo omni-directional microphone'],
    idealFor: 'Huddle rooms with 4–5 participants',
    images: [img('peoplelink-i3-plus-webcam', 1000, 461), img('peoplelink-i3-plus-webcam-2', 942, 1000)],
  },
  {
    slug: 'i5-plus-webcam',
    name: 'i5 Plus Webcam',
    brand: PL,
    category: 'cameras',
    kind: 'product',
    summary: '3 MP wide-angle USB webcam with built-in microphone.',
    specs: ['3 MP (2048 × 1536) @ 30 fps', '110° FOV', 'YUV / MJPEG / H.264', 'USB, 1.5 m cable', 'Built-in microphone'],
    idealFor: 'Huddle rooms with 4–5 participants',
    images: [img('peoplelink-i5-plus-webcam', 976, 716), img('peoplelink-i5-plus-webcam-2', 939, 927)],
  },
  {
    slug: 'i8-plus-webcam',
    name: 'i8 Plus Webcam',
    brand: PL,
    category: 'cameras',
    kind: 'product',
    summary: '120° Full HD USB webcam with 4x digital zoom and 3 m audio pickup.',
    specs: ['1/2.7” CMOS, 2.07 MP effective', '1920 × 1080 @ 30 fps', 'YUY2 / H.264 / MJPEG', '120° FOV', '4x digital zoom', 'Built-in microphone, pickup up to 3 m', 'USB 2.0'],
    idealFor: 'Huddle rooms with 4–5 participants',
    images: [img('peoplelink-i8-plus-webcam', 1000, 590)],
  },
  {
    slug: 'uvc-100',
    name: 'UVC 100',
    brand: PL,
    category: 'cameras',
    kind: 'product',
    summary: 'Portable all-in-one USB camera with microphone and speaker.',
    specs: ['1/2.8” fixed focus', '1920 × 1080 (compressed)', '110° FOV', 'Built-in omni-directional microphone', 'USB 2.0', 'Portable external microphone and speaker'],
    idealFor: 'Huddle rooms with 4–5 participants',
    images: [img('peoplelink-uvc-100', 633, 1000)],
  },
  {
    slug: 'icam-whd-1080-10x',
    name: 'iCam WHD-1080 10X USB (H.264)',
    brand: PL,
    category: 'cameras',
    kind: 'product',
    summary: 'USB PTZ camera with 10x optical zoom and RS-232 control.',
    specs: [
      '1/2.7” CMOS sensor',
      '1920 × 1080 @ 30 fps (YUY2, MJPEG, H.264)',
      '10x optical / 16x digital zoom',
      '58.5° FOV',
      'Ports: USB 2.0, RS-232 · VISCA / Pelco-D / Pelco-P',
      'Pan ±170°, tilt 30°–90°',
      '64 presets',
    ],
    idealFor: 'Meeting rooms with 6–10 participants',
    images: [img('peoplelink-icam-whd-1080-10x', 467, 628), img('peoplelink-icam-whd-1080-10x-2', 501, 200)],
  },
  {
    slug: 'icam-whd-1080-12x',
    name: 'iCam WHD 1080 USB 12X',
    brand: PL,
    category: 'cameras',
    kind: 'product',
    summary: '1080p60 USB 3.0 PTZ camera with 12x optical zoom and 128 presets.',
    specs: ['1/2.7” CMOS, 2.7 MP', 'True HD 1080p @ 60 fps', '12x optical / 12x digital zoom', '72.5° FOV', '128 presets', 'USB 3.0, RS-232', 'Pan −170° to +170°, tilt −30° to +90°'],
    idealFor: 'Conference rooms with 10–15 participants',
    images: [img('peoplelink-icam-whd-1080-12x', 909, 728), img('peoplelink-icam-whd-1080-12x-2', 493, 138)],
  },
  {
    slug: 'elite-fhd-premium',
    name: 'Elite FHD Premium Series',
    brand: PL,
    models: ['12x', '20x', '30x'],
    category: 'cameras',
    kind: 'product',
    summary: 'Premium PTZ camera series with up to 30x optical zoom and USB, IP and 3G-SDI outputs.',
    specs: [
      '1/2.7” 2 MP sensor',
      '1080p Full HD @ 60 fps',
      'H.265 / H.264 / MJPEG',
      '12x / 20x / 30x optical zoom · 16x / 16x / 8x digital zoom',
      '72.5° / 60.7° / 60.7° FOV',
      'USB 3.0, RJ45, 3G-SDI, USB 2.0 (recording)',
      '255 presets · pan −170° to +170°, tilt −30° to +90°',
    ],
    idealFor: 'Conference rooms with 10–30 participants',
    images: [img('peoplelink-elite-fhd-premium', 612, 822), img('peoplelink-elite-fhd-premium-2', 600, 206)],
  },

  // ——— AI & tracking cameras ———
  {
    slug: 'speaker-track-pro',
    name: 'Speaker Track Pro',
    brand: PL,
    category: 'ai-cameras',
    kind: 'product',
    summary: 'Dual-camera speaker-tracking system for boardrooms.',
    specs: ['1/2.8” CMOS, 2 MP', '1920 × 1080 @ 60 fps', '12x optical / 12x digital zoom', 'H.264 / H.265', '72.5° FOV', 'Outputs: 3G-SDI, HDMI, USB 2.0, Ethernet'],
    images: [img('peoplelink-speaker-track-pro', 984, 344), img('peoplelink-speaker-track-pro-2', 1000, 146)],
  },
  {
    slug: 'icam-fhd-lt-20x-teacher',
    name: 'iCam FHD-LT 20x Teacher',
    brand: PL,
    models: ['Teacher', 'Student'],
    category: 'ai-cameras',
    kind: 'product',
    summary: 'Auto-tracking lecture camera that follows the presenter in classrooms and training rooms.',
    specs: ['1/2.8” Exmor CMOS, 2.14 MP', '1920 × 1080 @ 60 fps', '20x optical / 12x digital zoom', '59.5° FOV', 'USB 3.0 / SDI / DVI', 'H.264 / H.265 / MJPEG'],
    images: [img('peoplelink-icam-fhd-lt-20x-teacher', 823, 597), img('peoplelink-icam-fhd-lt-20x-teacher-2', 833, 143)],
  },
  {
    slug: 'instavc-4k-auto-frame',
    name: 'InstaVC 4K-84/120 Auto Frame',
    brand: PL,
    models: ['84° FOV', '120° FOV'],
    category: 'ai-cameras',
    kind: 'product',
    summary: '4K auto-framing ePTZ camera with built-in microphone, in two field-of-view variants.',
    specs: ['1/2.5” CMOS, 8.51 MP effective', 'Ultra 4K', 'H.265 / H.264 / MJPEG / YUY2', 'ePTZ, 8x digital zoom', '84° / 120° FOV (2 variants)', 'HDMI, USB 3.0, 3.5 mm audio', 'Built-in microphone'],
    images: [img('peoplelink-instavc-4k-auto-frame', 816, 530), img('peoplelink-instavc-4k-auto-frame-2', 906, 548)],
  },
  {
    slug: '4k-af-camera-soundbar',
    name: '4K AF Camera – Soundbar',
    brand: PL,
    category: 'ai-cameras',
    kind: 'product',
    summary: '4K60 video bar combining camera, microphones and a 90 dB speaker.',
    specs: [
      '1/2.5” CMOS, 8.51 MP',
      'Ultra 4K @ 60 fps',
      'H.264 / MJPEG / YUY2 / NV12',
      'ePTZ / MPT, 5x digital zoom',
      '120° FOV',
      'HDMI, USB 3.0',
      'Built-in microphone, 6 m pickup',
      'Built-in 90 dB speaker · 2.4G remote',
    ],
    images: [img('peoplelink-4k-af-camera-soundbar', 1000, 237), img('peoplelink-4k-af-camera-soundbar-2', 750, 129)],
  },

  // ——— Conference audio ———
  {
    slug: 'i100-p',
    name: 'i100-P Conference Phone',
    brand: PL,
    category: 'conference-audio',
    kind: 'product',
    summary: 'Wired PSTN conference phone with omni-directional microphone.',
    specs: ['1 omni-directional microphone', '85 dB speaker output', 'Wired, RJ-11 interface', '80 Hz – 14 kHz frequency response', 'PSTN calling'],
    idealFor: 'Huddle rooms and conference rooms',
    images: [img('peoplelink-i100-p', 1000, 752)],
  },
  {
    slug: 'quadro',
    name: 'Quadro',
    brand: PL,
    category: 'conference-audio',
    kind: 'product',
    summary: 'USB conference speakerphone with four microphones and expansion mics.',
    specs: ['4 uni-directional microphones', '92 dB speaker output', 'Wired, USB / 3.5 mm', 'USB 2.0 Type-B speakerphone', 'Pickup range 3 m, 5 m with external mics'],
    idealFor: 'Boardrooms and conference rooms',
    images: [img('peoplelink-quadro', 792, 532), img('peoplelink-quadro-2', 931, 400)],
  },
  {
    slug: 'quadro-p',
    name: 'Quadro P',
    brand: PL,
    category: 'conference-audio',
    kind: 'product',
    summary: 'USB + PSTN conference speakerphone with call bridging and PoE.',
    specs: [
      '4 uni-directional microphones',
      '92 dB speaker output',
      'USB / 3.5 mm, RJ11 and PoE',
      '100 Hz – 16 kHz frequency response',
      'USB speakerphone + PSTN + bridging',
      'Built-in AEC, AGC, ANS',
      'Pickup range 3 m, 5 m with external mics',
    ],
    idealFor: 'Boardrooms and conference rooms',
    images: [img('peoplelink-quadro-p', 952, 933), img('peoplelink-quadro-p-2', 956, 472)],
  },
  {
    slug: 'quadro-touch',
    name: 'Quadro Touch',
    brand: PL,
    category: 'conference-audio',
    kind: 'product',
    summary: 'Touch-screen speakerphone that doubles as room control and soft endpoint.',
    specs: ['5.5-inch FHD touch screen', 'One omni-directional microphone', '92 dB speaker output', 'USB, HDMI, Bluetooth, RJ45', 'USB speakerphone + room control + soft endpoint'],
    idealFor: 'Boardrooms and conference rooms',
    images: [img('peoplelink-quadro-touch', 1000, 702)],
  },
  {
    slug: 'uvc-15',
    name: 'UVC 15 / UVC 15B',
    brand: PL,
    models: ['UVC 15', 'UVC 15B (Bluetooth)'],
    category: 'conference-audio',
    kind: 'product',
    summary: 'Portable USB speakerphone; the 15B adds Bluetooth.',
    specs: [
      '3 uni-directional microphones',
      '89 dB speaker output, 3 m pickup',
      'Built-in AEC, AGC, ANS',
      'USB / Bluetooth, 3.5 mm AUX',
      '30 Hz – 16 kHz frequency response',
      '6 ft USB cable',
    ],
    idealFor: 'Boardrooms and conference rooms',
    images: [img('peoplelink-uvc-15', 934, 677), img('peoplelink-uvc-15-2', 960, 503)],
  },
  {
    slug: 'pvc-50-ws',
    name: 'PVC 50 WS / WS Cascade',
    brand: PL,
    models: ['PVC 50 WS (speakerphone)', 'PVC 50 WS Cascade 2C / 3C / 4C (microphones)'],
    category: 'conference-audio',
    kind: 'product',
    summary: 'Wireless speakerphone, with cascading wireless microphone pods for larger tables.',
    specs: [
      'One omni-directional microphone (per pod on Cascade)',
      '87 dB speaker output (WS)',
      'Pickup range up to 10 ft',
      'Wireless · USB 2.0 Type-B / 3.5 mm',
      'Built-in AEC, AGC, ANS',
      'Cascade: wireless cascading, bundled as 2C / 3C / 4C',
    ],
    idealFor: 'Boardrooms and conference rooms',
    images: [img('peoplelink-pvc-50-ws', 983, 581)],
  },

  // ——— Audio processing & control ———
  {
    slug: 'multichannel-dsp',
    name: 'Multichannel All-in-One DSP',
    brand: PL,
    category: 'audio-control',
    kind: 'product',
    summary: '19-inch rack DSP with built-in amplifier and wireless microphones.',
    specs: [
      '19-inch rack-mountable, self-protection SMT circuit',
      'Mics: 2x handheld / 1 handheld + 1 lapel / 2x lapel',
      'Microphone range 300 ft, 80 Hz – 18 kHz',
      'Amplifier: 2 × 50 W @ 8 Ω, 20 Hz – 20 kHz',
      'DSP: 30 Hz – 16 kHz, built-in AEC, AGC, DNR',
      'High efficiency (~90%)',
    ],
    images: [img('peoplelink-multichannel-dsp', 968, 328), img('peoplelink-multichannel-dsp-2', 968, 112)],
  },
  {
    slug: 'amplifier-200w',
    name: 'Amplifier 200W',
    brand: PL,
    category: 'audio-control',
    kind: 'product',
    summary: '200 W Class-D stereo mixer amplifier with microphone inputs and RS-232 control.',
    specs: [
      'Class-D, 2-channel stereo, 200 W RMS',
      '2 × 100 W @ 8 Ω, 24 V DC',
      '20 Hz – 20 kHz response',
      'Bass, treble, equaliser',
      '2 balanced phantom mic inputs (XLR), 1 unbalanced mic input',
      'RS-232 for controller',
    ],
    idealFor: 'Boardrooms and conference rooms',
    images: [img('peoplelink-amplifier-200w', 1000, 181)],
  },
  {
    slug: 'dsp-cm',
    name: 'DSP-CM',
    brand: PL,
    models: ['DSP-CM (up to 2 mics)', 'DSP-CM Pro (up to 4 mics)'],
    category: 'audio-control',
    kind: 'product',
    summary: 'Audio processor with omni-directional ceiling microphones for hands-free rooms.',
    specs: [
      'DSP with omni-directional ceiling microphones',
      'Up to 2 ceiling mics (DSP-CM) · up to 4 (DSP-CM Pro)',
      'Pickup radius up to 10 m',
      '50 Hz – 20 kHz, SNR 75 dB',
      'Adaptive echo cancellation and noise suppression, smart mixing',
      'Integrates with PeopleLink all-in-one DSP and podium range',
    ],
    idealFor: 'Training rooms, classrooms and demo rooms',
    images: [img('peoplelink-dsp-cm', 899, 510), img('peoplelink-dsp-cm-pro', 1000, 529), img('peoplelink-dsp-cm-2', 632, 487)],
  },
  {
    slug: 'look-at-me',
    name: 'Look-At-Me (8 Button)',
    brand: PL,
    category: 'audio-control',
    kind: 'product',
    summary: 'Wireless push-to-view buttons that point PTZ cameras at the active speaker.',
    specs: ['8 wireless buttons, RF-based', 'RS-232 control for PTZ cameras', 'Pelco-P / Pelco-D / VISCA commands', 'Consumes less than 2 W'],
    images: [img('peoplelink-look-at-me', 983, 901)],
  },
  {
    slug: 'instacontroller-rsi-552',
    name: 'InstaController RSI (552)',
    brand: PL,
    category: 'audio-control',
    kind: 'product',
    summary: 'IP room-control system operated from an Android app or touch panel, on LAN, WAN or internet.',
    specs: [
      'Central control system',
      '3x bi-directional RS-232 ports',
      '2x hybrid RS-232/IR ports',
      '1x RJ-45 port',
      '5x high-voltage relay controls',
      'Integrates with PeopleLink e-Podiums',
    ],
    idealFor: 'Boardroom and classroom automation, conference rooms, seminar halls',
    images: [
      img('peoplelink-instacontroller-rsi-552', 1000, 589),
      img('peoplelink-instacontroller-rsi-552-2', 1000, 677),
      img('peoplelink-instacontroller-rsi-552-3', 1000, 110),
    ],
  },
  {
    slug: 'instacontroller-arsi-31074',
    name: 'InstaController ARSI (31074)',
    brand: PL,
    category: 'audio-control',
    kind: 'product',
    summary: 'IP room-control system with relay, RS-232 and IR control, managed from an Android app.',
    specs: [
      'Central control system',
      '3x bi-directional RS-232 ports',
      '2x hybrid RS-232/IR ports',
      '1x RJ-45 port',
      '5x high-voltage relay controls',
      'Integrates with PeopleLink e-Podiums',
    ],
    idealFor: 'Boardroom and classroom automation, conference rooms, seminar halls',
    images: [img('peoplelink-instacontroller-arsi-31074', 1000, 563), img('peoplelink-instacontroller-arsi-31074-2', 1000, 114)],
  },
  {
    slug: 'wireless-chairman-delegate-system',
    name: 'Wireless Chairman Delegate System',
    brand: PL,
    category: 'audio-control',
    kind: 'product',
    summary: '5 GHz wireless discussion system for chairman and delegate microphones.',
    specs: ['5 GHz communication band for stronger anti-jamming', 'Higher bandwidth and transmission speed', 'Dual-CPU processor'],
    images: [img('peoplelink-wireless-chairman-delegate', 501, 264)],
  },

  // ——— Classroom ———
  {
    slug: 'e-podium',
    name: 'e-Podium Series',
    brand: PL,
    models: [
      'e-Podium Delta (PCU-PDP-EP-DELTA)',
      'e-Podium Delta Plus (PCU-PDP-EP-DELTA PLUS)',
      'e-Podium Ultra (PCU-PDP-EP-ULTRA)',
      'e-Podium Ultra Plus (PCU-PDP-EP-ULTRA PLUS)',
      'e-Podium Elite (PCU-PDP-EP-ELITE)',
    ],
    category: 'classroom',
    kind: 'product',
    summary: 'Smart podium integrating PC, audio and control to run the whole presentation from one place.',
    specs: [
      'PC, audio and control system integrated into a podium',
      'Control the projector, project and annotate content',
      'Manage ambience lighting or temperature from the podium',
      '21.5-inch touch monitor, gooseneck microphone, keyboard tray (model dependent)',
      'Equipment rack and safety lock',
    ],
    images: [img('peoplelink-e-podium', 262, 237), img('peoplelink-e-podium-2', 220, 250), img('peoplelink-e-podium-3', 262, 188), img('peoplelink-e-podium-4', 1000, 677)],
  },
  {
    slug: 'collaborate-interactive-display',
    name: 'Collaborate Interactive Displays',
    brand: PL,
    models: ['T65+', 'T75+', 'T86+'],
    category: 'classroom',
    kind: 'product',
    summary: '4K UHD interactive touch displays for classrooms and meeting rooms.',
    specs: [
      '4K UHD, 3840 × 2160',
      'Optical bonding, anti-glare, anti-fingerprint glass',
      '20 touch points (Windows) / 10 (Android)',
      'Stylus or finger; 2 mm precision writing',
      'Built-in Android writing software, all-channel annotation',
      'Smart sidebar menu, public USB auto switch',
    ],
    images: [img('peoplelink-collaborate-interactive-display', 443, 268)],
  },
  {
    slug: 'interactive-whiteboard-solution',
    name: 'Interactive White Board Solution',
    brand: PL,
    category: 'classroom',
    kind: 'product',
    summary: 'Connects to your projector and turns a regular whiteboard or any surface into an interactive board.',
    specs: ['Works with an existing projector', 'Take notes and annotate PowerPoint presentations', 'Turns any surface into an interactive board'],
    images: [img('peoplelink-interactive-whiteboard', 1000, 563)],
  },

  // ——— Healthcare ———
  {
    slug: 'e-cart',
    name: 'e-Cart (Health Cart)',
    brand: PL,
    models: ['Health Cart-1', 'Health Cart-2', 'Health Cart-3'],
    category: 'healthcare',
    kind: 'product',
    summary: 'Mobile video conferencing cart with UPS option for clinical and industrial spaces.',
    specs: ['Mobile cart with display and camera', 'UPS option', 'Three configurations'],
    idealFor: 'Operation theatres, ICUs, newborn and isolation wards, manufacturing floors, showrooms',
    images: [img('peoplelink-e-cart', 393, 730), img('peoplelink-e-cart-2', 393, 816), img('peoplelink-e-cart-3', 401, 784)],
  },

  // ——— Digital signage (solution types; makes and models proposed per project) ———
  ...(
    [
      ['commercial-signage-displays', 'Commercial Signage Displays', 'Indoor and outdoor commercial-grade screens in portrait or landscape for lobbies, stores and campuses.', 'signage'],
      ['led-video-walls', 'LED Displays & Video Walls', 'Fine-pitch LED and tiled LCD video walls for reception areas, control rooms and experience centres.', 'videoWall'],
      ['digital-menu-boards', 'Digital Menu Boards', 'Screen-based menu cards for cafeterias, QSRs and food courts, updated centrally.', 'menuBoard'],
      ['video-wall-controllers', 'Video Wall Controllers & Processors', 'Controllers and processors to drive multi-screen layouts and live sources across a wall.', 'videoWall'],
      ['kiosks-interactive-displays', 'Digital Kiosks & Interactive Displays', 'Touch kiosks for wayfinding, visitor check-in, patient information and self-service.', 'kiosk'],
      ['signage-media-players-cms', 'Media Players & CMS Scheduling', 'Media players with content management to schedule playlists across one screen or hundreds.', 'mediaPlayer'],
      ['signage-installation-support', 'Installation, Configuration & Maintenance', 'Site survey, mounting, cabling, player setup, content onboarding and ongoing support.', 'conference'],
    ] as const
  ).map(
    ([slug, name, summary, render]): AvItem => ({
      slug,
      name,
      summary,
      category: 'signage',
      kind: 'solution',
      render,
      images: [],
      specs: ['Make, model and size proposed to suit the site and budget', 'Indoor or outdoor options on request', 'Supply, installation and support quoted per project'],
      idealFor: 'Retail, corporate offices, hospitals, education, hospitality',
    }),
  ),
]

/** Digital engagement use cases, from the supplied digital signage slide. */
export const signageUseCases = [
  'Branding & retail promotions',
  'Customer acquisition & engagement',
  'In-store entertainment',
  'Visitor engagement',
  'HR communication',
  'Digital menu cards',
  'Patient information channels / OPD boards',
  'Loyalty programmes',
  'Customer experience enhancement',
]

export const avSourceNote =
  'PeopleLink product images and specifications are from the manufacturer presentation supplied to Zova Infotech. Pricing, availability and warranty are confirmed on quotation.'
