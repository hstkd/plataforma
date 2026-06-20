import 'server-only'

// =====================================================================
// Integración de clases en vivo — Zoom (scaffold).
// Sin credenciales (ZOOM_CLIENT_ID/SECRET/ACCOUNT_ID) corre en MODO
// SIMULADO y genera un enlace de reunión ficticio determinista.
// Con credenciales reales usa Server-to-Server OAuth + la API de Zoom.
// =====================================================================

export const zoomEnabled = Boolean(
  process.env.ZOOM_CLIENT_ID && process.env.ZOOM_CLIENT_SECRET && process.env.ZOOM_ACCOUNT_ID,
)

export interface CreateMeetingInput {
  topic: string
  startTime: string // ISO
  durationMin: number
  attendeeEmail: string
}

export interface ZoomMeeting {
  meetingId: string
  joinUrl: string
  startUrl?: string
  simulated: boolean
}

async function getAccessToken(): Promise<string> {
  // Server-to-Server OAuth: intercambia client credentials por un token.
  const basic = Buffer.from(
    `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`,
  ).toString('base64')
  const res = await fetch(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`,
    { method: 'POST', headers: { Authorization: `Basic ${basic}` } },
  )
  if (!res.ok) throw new Error(`Zoom OAuth falló: ${res.status}`)
  const data = (await res.json()) as { access_token: string }
  return data.access_token
}

export async function createZoomMeeting(input: CreateMeetingInput): Promise<ZoomMeeting> {
  if (!zoomEnabled) {
    // MODO SIMULADO: enlace ficticio pero estable por reunión.
    const id = String(Math.abs(hashCode(input.topic + input.startTime)) % 1_000_000_0000)
    return {
      meetingId: id,
      joinUrl: `https://zoom.us/j/${id}?pwd=demo`,
      simulated: true,
    }
  }

  const token = await getAccessToken()
  const host = process.env.ZOOM_HOST_EMAIL || 'me'
  const res = await fetch(`https://api.zoom.us/v2/users/${host}/meetings`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      topic: input.topic,
      type: 2, // reunión programada
      start_time: input.startTime,
      duration: input.durationMin,
      timezone: 'America/Guayaquil',
      settings: { join_before_host: false, waiting_room: true },
    }),
  })
  if (!res.ok) throw new Error(`Zoom create meeting falló: ${res.status}`)
  const data = (await res.json()) as { id: number; join_url: string; start_url: string }
  return {
    meetingId: String(data.id),
    joinUrl: data.join_url,
    startUrl: data.start_url,
    simulated: false,
  }
}

function hashCode(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return h
}
