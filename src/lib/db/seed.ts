import type { Course, Plan } from '@/lib/types'

// =====================================================================
// Datos semilla — contenido inicial de la plataforma.
// Las contraseñas van en claro SOLO para la demo; el store las hashea
// al inicializar. En producción los datos vienen de PostgreSQL (Prisma).
// =====================================================================

const SAMPLE = {
  hero: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  v1: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  v2: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  v3: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  v4: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
}

const cover = (seed: string) => `https://picsum.photos/seed/${seed}/960/600`

export const VIDEO_HERO = SAMPLE.hero

export interface SeedUser {
  id: string
  email: string
  name: string
  password: string
  role: 'STUDENT' | 'ADMIN'
  belt: 'WHITE' | 'YELLOW' | 'GREEN' | 'BLUE' | 'RED' | 'BLACK'
  avatarUrl: string
  xp: number
  streakDays: number
}

export const seedUsers: SeedUser[] = [
  {
    id: 'u_admin',
    email: 'maestro@hstkd.com',
    name: 'Henry Sigchos',
    password: 'taekwondo',
    role: 'ADMIN',
    belt: 'BLACK',
    avatarUrl: 'https://i.pravatar.cc/200?img=12',
    xp: 9999,
    streakDays: 320,
  },
  {
    id: 'u_demo',
    email: 'alumno@hstkd.com',
    name: 'Alex Rivera',
    password: 'taekwondo',
    role: 'STUDENT',
    belt: 'GREEN',
    avatarUrl: 'https://i.pravatar.cc/200?img=33',
    xp: 1480,
    streakDays: 12,
  },
]

export const seedPlans: Plan[] = [
  {
    id: 'plan_basico',
    slug: 'basico',
    name: 'Cinturón Blanco',
    priceCents: 0,
    interval: 'MONTH',
    highlighted: false,
    features: [
      'Acceso a contenido gratuito',
      'Seguimiento de progreso y XP',
      '1 clase muestra por mes',
    ],
  },
  {
    id: 'plan_pro',
    slug: 'pro',
    name: 'Cinturón Negro',
    priceCents: 1900,
    interval: 'MONTH',
    highlighted: true,
    stripePriceId: 'price_pro_monthly_PLACEHOLDER',
    features: [
      'Biblioteca completa (7 categorías)',
      'Nuevos cursos cada semana',
      'Rutas de progreso por cinturón',
      '10% de descuento en clases privadas',
      'Certificados de avance',
    ],
  },
  {
    id: 'plan_elite',
    slug: 'elite',
    name: 'Élite Competidor',
    priceCents: 4900,
    interval: 'MONTH',
    highlighted: false,
    stripePriceId: 'price_elite_monthly_PLACEHOLDER',
    features: [
      'Todo lo del plan Cinturón Negro',
      '2 clases privadas por Zoom al mes',
      'Plan de entrenamiento personalizado',
      'Análisis de video de tu técnica',
      'Acceso prioritario a la agenda',
    ],
  },
]

export const seedCourses: Course[] = [
  {
    id: 'c_poomsae_1',
    slug: 'poomsae-taegeuk-1-3',
    title: 'Poomsae Taegeuk 1 al 3',
    category: 'POOMSAE',
    summary: 'Domina las tres primeras formas oficiales con detalle milimétrico.',
    description:
      'Recorrido completo por Taegeuk Il Jang, Ee Jang y Sam Jang. Cada movimiento explicado desde la postura, la respiración y el significado filosófico, con vistas frontal y lateral.',
    coverUrl: cover('poomsae1'),
    trailerUrl: SAMPLE.v1,
    requiredBelt: 'WHITE',
    access: 'MEMBERSHIP',
    priceCents: 0,
    durationMin: 48,
    published: true,
    lessons: [
      {
        id: 'l_p1_1', order: 1, title: 'Taegeuk Il Jang — Keon (El cielo)',
        videoUrl: SAMPLE.v1, durationSec: 540,
        description: 'La primera forma. Posiciones básicas y bloqueos bajos.',
        drills: [
          { id: 'd1', name: 'Ap seogi + arae makki', reps: '4 x 10 por lado' },
          { id: 'd2', name: 'Secuencia completa lenta', reps: '3 repeticiones', notes: 'Cuenta a 4 tiempos.' },
        ],
      },
      {
        id: 'l_p1_2', order: 2, title: 'Taegeuk Ee Jang — Tae (El lago)',
        videoUrl: SAMPLE.v2, durationSec: 600,
        description: 'Segunda forma. Introducción al ap chagi en transición.',
        drills: [{ id: 'd3', name: 'Ap chagi en desplazamiento', reps: '3 x 12' }],
      },
      {
        id: 'l_p1_3', order: 3, title: 'Taegeuk Sam Jang — Ra (El fuego)',
        videoUrl: SAMPLE.v3, durationSec: 660,
        description: 'Tercera forma. Ritmo y combinación de bloqueos.',
        drills: [{ id: 'd4', name: 'Forma a velocidad de examen', reps: '2 repeticiones' }],
      },
    ],
  },
  {
    id: 'c_combate_1',
    slug: 'combate-contraataque',
    title: 'Combate: el arte del contraataque',
    category: 'COMBATE',
    summary: 'Lee a tu rival, provoca su ataque y castiga con timing perfecto.',
    description:
      'Sistema de contraataque para Kyorugi olímpico: gestión de distancia, fintas, cortes y la patada de contra más puntuada del circuito.',
    coverUrl: cover('combate1'),
    trailerUrl: SAMPLE.v3,
    requiredBelt: 'BLUE',
    access: 'MEMBERSHIP',
    priceCents: 0,
    durationMin: 62,
    published: true,
    lessons: [
      {
        id: 'l_co_1', order: 1, title: 'Gestión de distancia y guardia',
        videoUrl: SAMPLE.v3, durationSec: 720,
        description: 'Distancia corta, media y larga. Cuándo entrar y cuándo cortar.',
        drills: [{ id: 'd5', name: 'Sombra de distancia', reps: '5 rounds x 1 min' }],
      },
      {
        id: 'l_co_2', order: 2, title: 'Bandal chagi de contra',
        videoUrl: SAMPLE.v4, durationSec: 680,
        description: 'La patada de contra más efectiva al cuerpo.',
        drills: [{ id: 'd6', name: 'Contra con paso atrás', reps: '4 x 15 por pierna' }],
      },
    ],
  },
  {
    id: 'c_tecnica_1',
    slug: 'tecnica-patadas-altas',
    title: 'Patadas altas impecables',
    category: 'TECNICA',
    summary: 'Dollyo, yop y dwit chagi limpias, altas y con control.',
    description:
      'Curso técnico para depurar tus patadas: chambeo, cadera, eje de apoyo y rearme. Ideal para subir tu nivel de ejecución y puntería.',
    coverUrl: cover('tecnica1'),
    trailerUrl: SAMPLE.v2,
    requiredBelt: 'YELLOW',
    access: 'MEMBERSHIP',
    priceCents: 0,
    durationMin: 55,
    published: true,
    lessons: [
      {
        id: 'l_t_1', order: 1, title: 'Dollyo chagi — la patada circular',
        videoUrl: SAMPLE.v2, durationSec: 560,
        description: 'Mecánica completa de la patada más usada del Taekwondo.',
        drills: [{ id: 'd7', name: 'Chambeo en pared', reps: '3 x 20 por pierna', notes: 'Mantén la rodilla alta.' }],
      },
      {
        id: 'l_t_2', order: 2, title: 'Yop chagi — patada lateral',
        videoUrl: SAMPLE.v1, durationSec: 600,
        description: 'Alineación de cadera y filo del pie.',
        drills: [{ id: 'd8', name: 'Yop chagi sostenida', reps: '3 x 8 (2 s arriba)' }],
      },
    ],
  },
  {
    id: 'c_flex_1',
    slug: 'flexibilidad-split',
    title: 'Flexibilidad total: hacia el split',
    category: 'FLEXIBILIDAD',
    summary: 'Rutina progresiva de movilidad para patadas más altas y limpias.',
    description:
      'Programa de 6 semanas de movilidad activa y pasiva para cadera e isquiosurales. Llega al split frontal y lateral de forma segura.',
    coverUrl: cover('flex1'),
    trailerUrl: SAMPLE.v4,
    requiredBelt: 'WHITE',
    access: 'FREE',
    priceCents: 0,
    durationMin: 40,
    published: true,
    lessons: [
      {
        id: 'l_f_1', order: 1, title: 'Calentamiento articular completo',
        videoUrl: SAMPLE.v4, durationSec: 480,
        description: 'Prepara cadera, tobillos y columna antes de estirar.',
        drills: [
          { id: 'd9', name: 'Círculos de cadera', reps: '2 x 12 por lado' },
          { id: 'd10', name: 'Patada controlada al frente', reps: '3 x 10' },
        ],
      },
      {
        id: 'l_f_2', order: 2, title: 'Estiramiento profundo de aductores',
        videoUrl: SAMPLE.v1, durationSec: 540,
        description: 'Trabajo PNF para ganar rango en el split lateral.',
        drills: [{ id: 'd11', name: 'Rana activa', reps: '4 x 45 s' }],
      },
    ],
  },
  {
    id: 'c_fuerza_1',
    slug: 'fuerza-explosiva',
    title: 'Fuerza explosiva para patear más fuerte',
    category: 'FUERZA',
    summary: 'Pliometría y fuerza funcional aplicada al gesto del taekwondista.',
    description:
      'Entrena la potencia que necesitas en el tatami: saltos, sentadillas, core y trabajo unilateral, sin necesidad de gimnasio.',
    coverUrl: cover('fuerza1'),
    trailerUrl: SAMPLE.v3,
    requiredBelt: 'YELLOW',
    access: 'PURCHASE',
    priceCents: 2400,
    durationMin: 50,
    published: true,
    lessons: [
      {
        id: 'l_fz_1', order: 1, title: 'Base de fuerza de piernas',
        videoUrl: SAMPLE.v3, durationSec: 600,
        description: 'Sentadilla, zancada y puente. La base de toda patada potente.',
        drills: [
          { id: 'd12', name: 'Sentadilla búlgara', reps: '4 x 10 por pierna' },
          { id: 'd13', name: 'Puente de glúteo', reps: '3 x 15' },
        ],
      },
      {
        id: 'l_fz_2', order: 2, title: 'Pliometría para explosividad',
        videoUrl: SAMPLE.v2, durationSec: 540,
        description: 'Saltos y multisaltos para transferir fuerza a velocidad.',
        drills: [{ id: 'd14', name: 'Salto al cajón', reps: '5 x 5' }],
      },
    ],
  },
  {
    id: 'c_velocidad_1',
    slug: 'velocidad-reaccion',
    title: 'Velocidad y reacción de competidor',
    category: 'VELOCIDAD',
    summary: 'Acelera tus patadas y reduce tu tiempo de reacción.',
    description:
      'Drills de frecuencia, footwork y reacción visual/auditiva para ganar la milésima que decide el combate.',
    coverUrl: cover('velocidad1'),
    trailerUrl: SAMPLE.v4,
    requiredBelt: 'GREEN',
    access: 'PURCHASE',
    priceCents: 2400,
    durationMin: 38,
    published: true,
    lessons: [
      {
        id: 'l_v_1', order: 1, title: 'Footwork y frecuencia de pie',
        videoUrl: SAMPLE.v4, durationSec: 420,
        description: 'Escalera de agilidad aplicada al desplazamiento del tatami.',
        drills: [{ id: 'd15', name: 'In-out en escalera', reps: '6 series' }],
      },
    ],
  },
  {
    id: 'c_mental_1',
    slug: 'mentalidad-competidor',
    title: 'Mentalidad de competidor',
    category: 'MENTAL',
    summary: 'Foco, control del nervio y mentalidad ganadora antes de competir.',
    description:
      'Herramientas de psicología deportiva: rutinas pre-combate, respiración, visualización y manejo de la presión.',
    coverUrl: cover('mental1'),
    trailerUrl: SAMPLE.v2,
    requiredBelt: 'WHITE',
    access: 'MEMBERSHIP',
    priceCents: 0,
    durationMin: 35,
    published: true,
    lessons: [
      {
        id: 'l_m_1', order: 1, title: 'Respiración y activación',
        videoUrl: SAMPLE.v2, durationSec: 420,
        description: 'Controla tu estado antes de saltar al tatami.',
        drills: [{ id: 'd16', name: 'Respiración 4-7-8', reps: '4 ciclos' }],
      },
      {
        id: 'l_m_2', order: 2, title: 'Visualización del combate',
        videoUrl: SAMPLE.v3, durationSec: 480,
        description: 'Ensaya mentalmente tu plan de pelea.',
        drills: [{ id: 'd17', name: 'Visualización guiada', reps: '1 sesión de 8 min' }],
      },
    ],
  },
]

export interface Testimonial {
  name: string
  role: string
  avatar: string
  text: string
  rating: number
}

export const seedTestimonials: Testimonial[] = [
  {
    name: 'María Fernanda C.',
    role: 'Cinturón Azul · Quito',
    avatar: 'https://i.pravatar.cc/120?img=45',
    text: 'Entreno desde casa con la rutina del maestro y mis patadas mejoraron muchísimo. ¡La biblioteca es enorme!',
    rating: 5,
  },
  {
    name: 'Jorge Andrade',
    role: 'Padre de alumno',
    avatar: 'https://i.pravatar.cc/120?img=53',
    text: 'Mi hijo no se pierde una clase. El sistema de progreso lo motiva como un videojuego.',
    rating: 5,
  },
  {
    name: 'Daniela P.',
    role: 'Élite Competidor',
    avatar: 'https://i.pravatar.cc/120?img=32',
    text: 'Las clases privadas por Zoom con análisis de video cambiaron mi nivel de combate. Totalmente recomendado.',
    rating: 5,
  },
]
