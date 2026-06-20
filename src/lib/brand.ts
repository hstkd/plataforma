import type { Belt, Category } from './types'

export const BRAND = {
  name: 'HS TKD Academy',
  suffix: 'OnLine',
  full: 'HS TKD Academy - OnLine',
  master: 'Henry Sigchos',
  masterTitle: 'Maestro fundador · 4.º Dan',
  korean: '태권도',
  tagline: 'Entrena Taekwondo de élite, donde sea que estés.',
  since: 2020,
  phoneIntl: '+593987465883',
  phone: '0987465883',
  email: 'henry21.sigchos@gmail.com',
  instagram: '@taekwondo_hs',
  instagramUrl: 'https://instagram.com/taekwondo_hs',
  whatsapp: 'https://wa.me/593987465883',
  locations: ['Quito', 'Cumbayá'],
} as const

export const BELTS: Record<
  Belt,
  { label: string; hex: string; textDark: boolean; level: number; meaning: string }
> = {
  WHITE: { label: 'Blanco', hex: '#f4f4f6', textDark: true, level: 0, meaning: 'Inicio · Pureza' },
  YELLOW: { label: 'Amarillo', hex: '#ffd400', textDark: true, level: 1, meaning: 'La tierra' },
  GREEN: { label: 'Verde', hex: '#2fae6b', textDark: false, level: 2, meaning: 'El crecimiento' },
  BLUE: { label: 'Azul', hex: '#2f6fd8', textDark: false, level: 3, meaning: 'El cielo' },
  RED: { label: 'Rojo', hex: '#e0142a', textDark: false, level: 4, meaning: 'El peligro' },
  BLACK: { label: 'Negro', hex: '#101014', textDark: false, level: 5, meaning: 'Maestría · Dan' },
}

export const BELT_ORDER: Belt[] = ['WHITE', 'YELLOW', 'GREEN', 'BLUE', 'RED', 'BLACK']

export const CATEGORIES: Record<
  Category,
  { label: string; emoji: string; blurb: string; accent: string }
> = {
  POOMSAE: {
    label: 'Poomsae',
    emoji: '🥋',
    blurb: 'Formas y secuencias técnicas con precisión milimétrica.',
    accent: '#ffd400',
  },
  COMBATE: {
    label: 'Combate',
    emoji: '🥊',
    blurb: 'Kyorugi: estrategia, timing y explosividad en el tatami.',
    accent: '#e0142a',
  },
  TECNICA: {
    label: 'Técnica',
    emoji: '⚡',
    blurb: 'Patadas y desplazamientos depurados al detalle.',
    accent: '#2f6fd8',
  },
  FLEXIBILIDAD: {
    label: 'Flexibilidad',
    emoji: '🧘',
    blurb: 'Movilidad y rango articular para patadas altas y limpias.',
    accent: '#2fae6b',
  },
  FUERZA: {
    label: 'Fuerza',
    emoji: '💪',
    blurb: 'Potencia funcional aplicada al gesto deportivo.',
    accent: '#ff7a00',
  },
  VELOCIDAD: {
    label: 'Velocidad',
    emoji: '🚀',
    blurb: 'Reacción, frecuencia de pie y aceleración.',
    accent: '#9b5cff',
  },
  MENTAL: {
    label: 'Preparación mental',
    emoji: '🧠',
    blurb: 'Foco, gestión emocional y mentalidad de competidor.',
    accent: '#00c2c2',
  },
}

export const CATEGORY_ORDER: Category[] = [
  'POOMSAE',
  'COMBATE',
  'TECNICA',
  'FLEXIBILIDAD',
  'FUERZA',
  'VELOCIDAD',
  'MENTAL',
]
