import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Padua',
    short_name: 'Padua',
    description: 'Padua family album.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [],
  }
}