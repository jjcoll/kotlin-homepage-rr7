/**
 * Discriminated union on `media` field:
 * - media: 'youtube' → requires youtubeId
 * - media: 'image'   → youtubeId not allowed
 *
 * Intersected with the shared fields so every section
 * always has title, description, buttonText, buttonLink.
 */

type SectionMedia =
  | { media: 'youtube'; youtubeId: string }
  | { media: 'image' }

export type SectionType = SectionMedia & {
  title: React.ReactNode
  description: React.ReactNode
  buttonText: string
  buttonLink: string
}
